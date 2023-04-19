import { page } from '$app/stores'
import { uuid4 } from '@sentry/utils'
import type { ThrelteContext, useCache } from '@threlte/core'
import { random, sample, shuffle } from 'lodash-es'
import { get } from 'svelte/store'
import { Camera, Vector3 } from 'three'
import { randFloat } from 'three/src/math/MathUtils'
import { SCALE } from '../settings'
import { archiveItems, papers } from '../store'
import PaperController from './Scene/PaperController'
import type { ArchiveItem } from './types'
import { getUnprojectedPosition } from './utils/getUnprojectedPosition'
import OrderManager from './utils/OrderManager'

export const createPaper = (
	{
		x,
		y,
		order = 0,
		threlte,
		item,
		selected = false
	}: {
		x: number
		y: number
		order?: number
		threlte: ThrelteContext
		item: ArchiveItem
		selected: boolean
	},
	cache: ReturnType<typeof useCache>
) =>
	PaperController.createPaperController(
		{
			id: `${item.id}-${uuid4()}`,
			x,
			y,
			order: order,
			metadata: item,
			selected
		},
		threlte,
		cache
	)

export const getRandomPaperPosition = (camera: Camera) => {
	// get camera bounding box
	const margin = -0.5
	const topLeft = getUnprojectedPosition(new Vector3(-1, -1, 0), camera).addScalar(-margin)
	const bottomRight = getUnprojectedPosition(new Vector3(1, 1, 0), camera).addScalar(margin)

	return {
		x: randFloat(topLeft.x, bottomRight.x),
		y: randFloat(topLeft.y, bottomRight.y)
	}
}

const calcInitialPaperPositions = (ctx: ThrelteContext) => {
	const camera = get(ctx.camera)
	// get camera bounding box
	const margin = 0.5
	const topLeft = getUnprojectedPosition(new Vector3(-1, -1, 0), camera).addScalar(-margin)
	const bottomRight = getUnprojectedPosition(new Vector3(1, 1, 0), camera).addScalar(margin)

	let positions: { x: number; y: number }[] = []

	let r = 0
	const numCircles = import.meta.env.DEV ? 6 : 10

	for (let i = 0; i < numCircles; i++) {
		const numPapers = i === 0 ? 1 : Math.round(2 * r * Math.PI * 0.6)
		// const numPapers = 1
		const angle = (2 * Math.PI) / numPapers
		const offset = Math.random() * Math.PI
		for (let j = 0; j < numPapers; j++) {
			const x = Math.cos(offset + j * angle) * r
			const y = Math.sin(offset + j * angle) * r

			// only add papers that are visible for the camera
			if (x > topLeft.x && x < bottomRight.x && y > topLeft.y && y < bottomRight.y) {
				positions.push({ x, y })
			}
		}

		r += 1 * SCALE
	}

	positions = shuffle(positions)
	return positions
}

export const createPapersFromItems = async (
	ctx: ThrelteContext,
	items: ArchiveItem[],
	cache: ReturnType<typeof useCache>
) => {
	console.log('create papers from items')

	let createdSelectedPaper = false
	const selectedItemId = get(page).params.item

	const positions = calcInitialPaperPositions(ctx)

	const papersPromises = positions.slice(0, items.length).map(({ x, y }, i) => {
		const item = items[i % items.length]
		if (!item.image) return

		const selected = !createdSelectedPaper && selectedItemId === item.id
		if (selected) createdSelectedPaper = true

		return createPaper(
			{
				x,
				y,
				order: i,
				threlte: ctx,
				item,
				selected
			},
			cache
		)
	})

	const newPapers = (await Promise.all(papersPromises)).filter(Boolean)

	OrderManager.setPapers(newPapers)
	papers.set(newPapers)
}

export const insertRandomItem = async (
	ctx: ThrelteContext,
	cache: ReturnType<typeof useCache>,
	position?: { x: number; y: number }
) => {
	const { x, y } = position ?? getRandomPaperPosition(get(ctx.camera))

	// we don't want the same image on the screen twice
	const currentPapers = get(papers)
	// check what archive items are actually rendered right now
	const archiveItemsOnScreen = currentPapers.map((p) => p.metadata.id)
	let options = get(archiveItems)?.filter((i) => i && !archiveItemsOnScreen.includes(i.id))

	// in case all archive items are on the current screen we select the bottom one, or a deactivated one
	if (options?.length === 0) {
		const deactivatedPapers = currentPapers.filter((p) => !p.active).map((p) => p.metadata.id)
		const deactivatedOptions = get(archiveItems)?.filter(
			(i) => i && deactivatedPapers.includes(i.id)
		)
		const bottomPaper = OrderManager.bottomPaper
		const bottomOption = get(archiveItems)?.filter((i) => bottomPaper?.metadata.id === i?.id)
		options = deactivatedOptions ?? bottomOption
	}

	const item = sample(options)
	if (!item) throw new Error('Can not pick random item')

	const p = await createPaper(
		{
			x,
			y,
			order: -9999,
			threlte: ctx,
			item,
			selected: false
		},
		cache
	)

	papers.update((items) => {
		OrderManager.addPaper(p)
		items.push(p)
		return items
	})
}

export const replaceBottomPaper = (threlte: ThrelteContext, cache: ReturnType<typeof useCache>) => {
	const bottomPaper = OrderManager.removeBottomPaper()
	if (bottomPaper) {
		setTimeout(() => insertRandomItem(threlte, cache, get(bottomPaper.xy)), random(500, 2000))
		bottomPaper?.fadeOut()
	}
}
