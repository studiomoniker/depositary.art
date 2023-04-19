import { replaceBottomPaper } from '$lib/initPapers'
import type { ArchiveItem } from '$lib/types'
import { gotoCurrentArchive, gotoItemSlug } from '$lib/utils/gotoHelpers'
import OrderManager from '$lib/utils/OrderManager'
import type { ThrelteContext, useCache } from '@threlte/core'
import { cubicOut, sineInOut } from 'svelte/easing'
import { spring, tweened } from 'svelte/motion'
import { get, writable } from 'svelte/store'
import { Mesh, sRGBEncoding, Texture, TextureLoader, Vector2 } from 'three'
import { PAPER_THICKNESS, SCALE } from '../../settings'
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
	#cache
	#textureUrl

	dragger
	selector
	mesh?: Mesh
	active = true
	metadata
	threlte
	texture!: Texture
	hasTexture = false
	scale = spring(1, {
		precision: 0.0001
	})
	ratio = 1.0
	size = [0.25, 0, 25]
	isSelected = false
	isDragging = false
	isPortrait = false

	// start paper off screen
	xy = writable({ x: -100, y: -100 })
	spawnPosition = new Vector2(-100, -100)

	rotation = writable({ x: 0, z: Math.PI + Math.random() * Math.PI * 2 })
	lastSelected = Date.now()

	order = 0
	zIndex = calcZ(0)
	z
	id
	intro = true

	opacity = tweened(1, { easing: cubicOut, duration: 1000 })
	textOpacity = writable(0)
	dragStart = Date.now()

	private constructor(
		data: PaperData & {
			onload?: () => void
			onerror?: (err: Error) => void
		},
		ctx: ThrelteContext,
		cache: ReturnType<typeof useCache>
	) {
		this.id = data.id
		this.metadata = data.metadata
		this.threlte = ctx
		this.#cache = cache

		if (!data.metadata.image?.id) throw new Error('No texture for item')

		this.#textureUrl = data.metadata.image.id
		// only fake/test images have exactly the same ids
		if (data.metadata.id !== data.id) {
			this.#textureUrl = `${import.meta.env.VITE_CMS}/assets/${
				data.metadata.image.id
			}?access_token=${import.meta.env.VITE_AUTH_TOKEN}&key=fit-640`
		}

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

	private async loadTexture() {
		this.texture = await this.#cache.remember(async () => {
			const loader = new TextureLoader()
			return await loader.loadAsync(this.#textureUrl)
		}, [TextureLoader, this.#textureUrl])
	}

	public static async createPaperController(
		data: PaperData & {
			onload?: () => void
			onerror?: (err: Error) => void
		},
		ctx: ThrelteContext,
		cache: ReturnType<typeof useCache>
	) {
		const controller = new PaperController(data, ctx, cache)

		await controller.loadTexture()

		controller.texture.encoding = sRGBEncoding
		// calcuate size of paper based on image
		controller.ratio =
			controller.texture.image.naturalWidth / controller.texture.image.naturalHeight
		const max = 2.5 * SCALE
		let w, h
		if (controller.ratio >= 1.0) {
			w = max
			h = max / controller.ratio
		} else {
			controller.isPortrait = true
			w = max * controller.ratio
			h = max
		}

		// animate paper from random position to spawn position
		controller.size = [w, h]
		controller.spawnPosition = new Vector2(data.x, data.y)

		const cam = get(ctx.camera)
		const startPosition = data.selected
			? { x: data.x, y: data.y }
			: getStartPosition(controller.spawnPosition, cam)
		controller.xy.set(startPosition)

		setTimeout(
			async () => {
				controller.hasTexture = true
				if (data.selected) return

				const t = spring(
					{
						...startPosition,
						r: get(controller.rotation).z
					},
					{
						stiffness: 0.03,
						damping: 0.6,
						precision: 0.0001
					}
				)
				t.subscribe((val) => {
					if (!controller.isDragging && !controller.isSelected) {
						controller.xy.set({ x: val.x, y: val.y })
						controller.rotation.update((r) => {
							r.z = val.r
							return r
						})
					}
				})
				t.set({
					x: controller.spawnPosition.x,
					y: controller.spawnPosition.y,
					r: Math.random() * Math.PI
				})
			},
			data.selected || import.meta.env.DEV ? 0 : 500 + Math.random() * 3000
		)

		if (data.selected) {
			setTimeout(() => controller.select(), 10)
		}

		if (data.onload) data.onload()

		return controller
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
		this.moveToTop(true)
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

	async select() {
		if (!this.active) return
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

	async deselect() {
		this.moveToTop()
		await this.selector.deselect()
		this.lastSelected = Date.now()
		this.isSelected = false
	}

	async onClick() {
		if (!this.active) return

		const current = get(selectedPaper)
		if (current?.metadata.id === this.metadata.id && current?.id !== this.id) return

		if (current?.id === this.id) {
			selectedPaper.set(undefined)
			await this.deselect()
			gotoCurrentArchive()
		} else {
			await this.select()
			gotoItemSlug(this.metadata.id)
		}
	}

	setOrder(order: number) {
		this.order = order
		this.zIndex = calcZ(order)
		if (this.z && !this.isSelected && !this.isDragging) this.z.set(this.zIndex)
	}

	fadeOut() {
		if (this.isDragging) this.endDrag()
		this.active = false
		this.opacity.set(0).then(() => this.remove())
	}

	remove() {
		papers.update((items) => items.filter((p) => p !== this))
	}

	moveToTop(shouldReplaceBottomPaper = false) {
		OrderManager.moveToTop(this)

		if (shouldReplaceBottomPaper) replaceBottomPaper(this.threlte, this.#cache)
	}
}

export default PaperController
