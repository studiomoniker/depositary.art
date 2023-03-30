import type { ArchiveItem } from '$lib/types'
import { gotoCurrentArchive, gotoItemSlug } from '$lib/utils/gotoHelpers'
import type { ThrelteContext } from '@threlte/core'
import { cubicOut, sineInOut } from 'svelte/easing'
import { spring, tweened } from 'svelte/motion'
import { get, writable } from 'svelte/store'
import { Mesh, Texture, TextureLoader, Vector2, Vector3 } from 'three'
import { PAPER_THICKNESS } from '../../settings'
import { draggingPaperMesh, papers, selectedPaper } from '../../store'
import { getStartPosition } from '../utils/getStartPosition'
import PaperDragAnimation from './PaperDragAnimation'
import PaperSelectAnimation from './PaperSelectAnimation'

export type PaperTransformation = {
	pos: {
		x?: number
		y?: number
		z?: number
	}
	rot: {
		x?: number
		z?: number
	}
}
export type RequiredPaperTransformation = {
	pos: Required<PaperTransformation['pos']>
	rot: Required<PaperTransformation['rot']>
}

export type PaperData = {
	id: number | string
	x: number
	y: number
	order: number
	metadata: ArchiveItem
	selected: boolean
}

const Z_ON_TOP = 1.5
const calcZ = (order: number) => (order + 10) * PAPER_THICKNESS

class PaperController {
	dragger
	selector
	mesh?: Mesh
	active = true
	metadata
	threlte
	texture: Texture
	hasTexture = false
	scale = spring(1, {
		precision: 0.0001
	})
	ratio = 1.0
	size = [0.25, 0, 25]
	isSelected = false
	isDragging = false
	isPortrait = false

	// xy: Spring<{ x: number; y: number }>;
	xy = writable({ x: 0, y: 0 })
	spawnPosition
	currentPosition = new Vector3()
	compensatedPosition = writable({ x: 0, y: 0 })
	preDragPosition = { x: 0, y: 0 }

	rotation = writable({ x: 0, z: Math.random() * Math.PI })
	lastSelected = Date.now()

	order = 0
	zIndex = calcZ(0)
	z
	id
	intro = true

	opacity = tweened(1, { easing: cubicOut, duration: 1000 })
	textOpacity = writable(0)
	dragStart = Date.now()

	constructor(data: PaperData, ctx: ThrelteContext) {
		this.id = data.id
		this.metadata = data.metadata
		this.threlte = ctx
		if (!data.metadata.image?.id) throw new Error('No texture for item')

		let textureUrl = data.metadata.image.id
		// only fake/test images have exactly the same ids
		if (data.metadata.id !== data.id) {
			textureUrl = `${import.meta.env.VITE_CMS}/assets/${data.metadata.image.id}?access_token=${
				import.meta.env.VITE_AUTH_TOKEN
			}&key=fit-640`
		}

		this.texture = new TextureLoader().load(textureUrl, () => {
			// calcuate size of paper based on image
			this.ratio = this.texture.image.naturalWidth / this.texture.image.naturalHeight
			const max = 2.5
			let w, h
			if (this.ratio >= 1.0) {
				w = max
				h = max / this.ratio
			} else {
				this.isPortrait = true
				w = max * this.ratio
				h = max
			}

			// animate paper from random position to spawn position
			this.size = [w, h]
			this.spawnPosition = new Vector2(data.x, data.y)

			const cam = get(ctx.camera)
			const startPosition = data.selected
				? { x: data.x, y: data.y }
				: getStartPosition(this.spawnPosition, cam)
			this.xy.set(startPosition)

			setTimeout(
				async () => {
					this.hasTexture = true
					if (data.selected) return

					const t = spring(startPosition, {
						stiffness: 0.05,
						damping: 0.6,
						precision: 0.0001
					})
					t.subscribe((val) => {
						if (!this.isDragging && !this.isSelected) this.xy.set(val)
					})
					t.set({ x: this.spawnPosition.x, y: this.spawnPosition.y })
				},
				data.selected ? 0 : 500 + Math.random() * 3000
			)
			// }, Math.random() * 500);

			if (data.selected) this.onClick()
		})

		this.order = data.order
		this.setOrder(data.order)

		this.z = tweened(calcZ(data.order), {
			easing: sineInOut
		})

		this.dragger = new PaperDragAnimation(this)
		this.selector = new PaperSelectAnimation(this)

		document.addEventListener('visibilitychange', (e) => {
			if (document.hidden) {
				this.scale.set(get(this.scale))
			}
		})
	}

	public tick() {
		if (!this.hasTexture || this.isSelected || this.intro) return

		this.dragger.tick()
		this.updateTransformation({
			pos: this.dragger.compensatedXY,
			rot: {
				z: this.dragger.rotation
			}
		})
	}

	updateTransformation(newTransformation: PaperTransformation) {
		if (!this.xy) return
		const { pos, rot } = newTransformation

		const cur = get(this.xy)

		if (cur.x !== pos.x || cur.y !== pos.y) {
			this.xy.update((item) => {
				const i = item
				if (pos.x) i.x = pos.x
				if (pos.y) i.y = pos.y
				return i
			})
		}
		if (pos.z && pos.z !== get(this.z)) this.z.set(pos.z, { duration: 0 })

		const curRot = get(this.rotation)
		if ((rot.x && rot.z && rot.x !== curRot.x) || rot.z !== curRot.z) {
			this.rotation.update((item) => {
				const i = item
				if (rot.x) i.x = rot.x
				if (rot.z) i.z = rot.z
				return i
			})
		}
	}

	public updateDragPosition(newX: number, newY: number, newAngle: number) {
		this.dragger.updatePosition(newX, newY, newAngle)
	}

	public getTransformationState() {
		return {
			pos: {
				...get(this.xy),
				z: get(this.z)
			},
			rot: get(this.rotation)
		}
	}

	startDrag(mesh: Mesh) {
		this.dragStart = Date.now()
		const selected = get(selectedPaper)
		if (selected?.id !== this.id) selected?.onClick()
		if (!this.active || this.isSelected) return

		if (this.intro) {
			this.xy.update((item) => item)
			this.intro = false
		}

		this.mesh = mesh
		this.isDragging = true

		draggingPaperMesh.set(this)
		this.dragger.startDrag(this.getTransformationState())
		this.z.set(Z_ON_TOP)
	}

	endDrag() {
		// if (Date.now() - this.dragStart < 50) return this.onClick();
		if (!this.isDragging || this.isSelected) return

		draggingPaperMesh.set(undefined)
		this.isDragging = false
		this.moveToTop()
	}

	onMouseOver() {
		// lastSelected is a bit of a hacky workaround... somehow this gets triggered sometimes after deselect
		if (get(draggingPaperMesh) || this.isSelected || Date.now() - this.lastSelected < 100) return
		this.scale.set(1.1)
	}

	onMouseOut() {
		if (this.isDragging || this.isSelected) return
		this.scale.set(1)
		this.z.set(this.zIndex)
	}

	async deselect() {
		this.moveToTop()
		await this.selector.deselect()
		this.lastSelected = Date.now()
		this.isSelected = false
	}

	async onClick() {
		const current = get(selectedPaper)
		if (current?.metadata.id === this.metadata.id && current?.id !== this.id) return

		if (current?.id === this.id) {
			selectedPaper.set(undefined)
			await this.deselect()
			gotoCurrentArchive()
		} else {
			gotoItemSlug(this.metadata.id)
			this.isSelected = true
			selectedPaper.set(this)

			const { x, y } = get(this.xy)
			const { x: rotationX, z: rotationZ } = get(this.rotation)

			this.selector.select({
				x,
				y,
				rotationX,
				rotationZ,
				z: get(this.z)
			})
		}
	}

	setOrder(order: number) {
		this.order = order
		this.zIndex = calcZ(order)
		if (this.z) this.z.set(this.zIndex)
	}

	fadeOut() {
		if (this.isDragging) this.endDrag()
		this.active = false
		this.opacity.set(0).then(() => this.remove())
	}

	remove() {
		papers.update((items) => items.filter((p) => p !== this))
		console.log('removed paper', this.id)
	}

	moveToTop() {
		const newPapers = get(papers)
		if (newPapers.length === 1) {
			this.setOrder(0)
			return
		}

		newPapers.sort((a, b) => {
			return a.order - b.order
		})

		const bottomPaper = newPapers.filter((p) => p !== this && p.active).shift()

		newPapers.forEach((p) => {
			if (p !== this) {
				const subtract = p.order > this.order ? 2 : 1
				p.setOrder(p.order - subtract)
			}
		})

		if (bottomPaper) {
			// bottomPaper.fadeOut();
			// const newPaper = createPaper({
			// 	...getRandomPaperPosition(get(this.threlte.camera)),
			// 	order: newPapers.length - 2,
			// 	texture: Math.floor(Math.random() * 29),
			// 	threlte: this.threlte
			// });
			// newPapers.push(newPaper);
		}

		if (newPapers.length > 1) {
			this.setOrder(newPapers.length - 2)
		}
		// papers.set(newPapers);
	}
}

export default PaperController