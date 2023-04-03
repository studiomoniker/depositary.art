import { page } from '$app/stores'
import type { ThrelteContext } from '@threlte/core'
import { shuffle } from 'lodash'
import { get } from 'svelte/store'
import { Camera, Vector3 } from 'three'
import { randFloat } from 'three/src/math/MathUtils'
import { papers } from '../store'
import PaperController from './Scene/PaperController'
import type { ArchiveItem } from './types'
import { getUnprojectedPosition } from './utils/getUnprojectedPosition'

export const createPaper = async ({
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
}): Promise<PaperController> => {
	return new Promise((resolve, reject) => {
		const p: PaperController = new PaperController(
			{
				id,
				x,
				y,
				order: order,
				metadata: item,
				selected,
				onload: () => resolve(p),
				onerror: (error) => reject(error)
			},
			threlte
		)
	})
}

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
	// const numCircles = 3;
	const numCircles = 3

	for (let i = 0; i < numCircles; i++) {
		const numPapers = i === 0 ? 1 : Math.round(2 * r * Math.PI * 0.6)
		// const numPapers = 1;
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
	papers.set([])
	console.log('create random papers')
	const positions = calcInitialPaperPositions(ctx)

	// positions = positions.slice(0, 10);
	positions.forEach(({ x, y }, i) => {
		const texture = `textures/${i % 29}.jpg`
		const fakeId = Math.round(Math.random() * 9999999).toString()
		createPaper({
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
		}).then((p) => {
			papers.update((items) => {
				items.push(p)
				return items
			})
		})
	})
}

export const createPapersFromItems = (ctx: ThrelteContext, items: ArchiveItem[]) => {
	papers.set([])
	console.log('create papers from items')
	const positions = calcInitialPaperPositions(ctx)

	let createdSelectedPaper = false
	const selectedItemId = get(page).params.item

	positions.forEach(({ x, y }, i) => {
		const item = items[i % items.length]
		if (!item.image) return

		const selected = !createdSelectedPaper && selectedItemId === item.id
		if (selected) createdSelectedPaper = true

		createPaper({
			id: Math.round(Math.random() * 9999999).toString(),
			x,
			y,
			order: i,
			threlte: ctx,
			item,
			selected
		}).then((p) => {
			papers.update((items) => {
				items.push(p)
				return items
			})
		})
	})
}
