import { page } from '$app/stores'
import { uuid4 } from '@sentry/utils'
import type { ThrelteContext } from '@threlte/core'
import { sample, shuffle } from 'lodash'
import { get } from 'svelte/store'
import { Camera, Vector3 } from 'three'
import { randFloat } from 'three/src/math/MathUtils'
import { archiveItems, papers } from '../store'
import PaperController from './Scene/PaperController'
import type { ArchiveItem } from './types'
import { getUnprojectedPosition } from './utils/getUnprojectedPosition'

export const createPaper = ({
	id,
	x,
	y,
	order = 0,
	threlte,
	item,
	selected = false
}: {
	id: number | string
	x: number
	y: number
	order?: number
	threlte: ThrelteContext
	item: ArchiveItem
	selected: boolean
}) =>
	new PaperController(
		{
			id,
			x,
			y,
			order: order,
			metadata: item,
			selected
		},
		threlte
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

	console.log('init papers')
	let positions: { x: number; y: number }[] = []

	let r = 0
	const numCircles = import.meta.env.DEV ? 3 : 10

	for (let i = 0; i < numCircles; i++) {
		const numPapers = i === 0 ? 1 : Math.round(2 * r * Math.PI * 0.6)
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

		r += 1
	}

	positions = shuffle(positions)
	return positions
}

export const initPapers = (ctx: ThrelteContext) => {
	console.log('create random papers')
	const positions = calcInitialPaperPositions(ctx)

	const newPapers: PaperController[] = []
	positions.forEach(({ x, y }, i) => {
		const texture = `textures/${i % 29}.jpg`
		const fakeId = uuid4()
		const p = createPaper({
			id: fakeId,
			x,
			y,
			order: i,
			threlte: ctx,
			item: {
				id: fakeId,
				image: {
					id: texture
				},
				title: `Test Title ${i}`,
				description: `<p>Test Description ${i}</p>`,
				palette: {
					Vibrant: [0, 200, 200]
				}
			},
			selected: false
		})

		newPapers.push(p)
	})

	papers.set(newPapers)
}

export const createPapersFromItems = (ctx: ThrelteContext, items: ArchiveItem[]) => {
	console.log('create papers from items')
	const newPapers: PaperController[] = []

	let createdSelectedPaper = false
	const selectedItemId = get(page).params.item

	const positions = calcInitialPaperPositions(ctx)
	positions.forEach(({ x, y }, i) => {
		const item = items[i % items.length]
		if (!item.image) return

		const selected = !createdSelectedPaper && selectedItemId === item.id
		if (selected) createdSelectedPaper = true

		const p = createPaper({
			id: uuid4(),
			x,
			y,
			order: i,
			threlte: ctx,
			item,
			selected
		})
		newPapers.push(p)
	})

	papers.set(newPapers)
}

export const insertRandomItem = (ctx: ThrelteContext, position?: { x: number; y: number }) => {
	const { x, y } = position ?? getRandomPaperPosition(get(ctx.camera))

	const item = sample(get(archiveItems))
	if (!item) throw new Error('Can not pick random item')

	const p = createPaper({
		id: uuid4(),
		x,
		y,
		order: -9999,
		threlte: ctx,
		item,
		selected: false
	})

	papers.update((items) => {
		OrderManager.addPaper(p)
		items.push(p)
		return items
	})
}
