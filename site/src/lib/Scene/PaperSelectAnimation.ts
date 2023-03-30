import isPerspectiveCamera from '$lib/utils/isPerspectiveCamera'
import { cubicInOut } from 'svelte/easing'
import { tweened } from 'svelte/motion'
import { get } from 'svelte/store'
import { degToRad } from 'three/src/math/MathUtils'
import type PaperController from './PaperController'

type AnimationState = {
	x: number
	y: number
	rotationX: number
	rotationZ: number
	z: number
}

class PaperSelectAnimation {
	paper: PaperController
	animation = tweened(
		{
			x: 0,
			y: 0,
			rotationX: 0,
			rotationZ: 0,
			progress: 0,
			z: 0,
			scale: 1
		},
		{ duration: 500, easing: cubicInOut }
	)
	prevState: AnimationState

	constructor(paper: PaperController) {
		this.paper = paper
		this.prevState = get(this.animation)
		this.animation.subscribe((val) => {
			paper.textOpacity.set(val.progress)
			paper.scale.set(val.scale, { hard: true })
			paper.updateTransformation({
				pos: {
					x: val.x,
					y: val.y,
					z: val.z
				},
				rot: {
					x: val.rotationX,
					z: val.rotationZ
				}
			})
		})
	}

	getPositionZ() {
		const cam = get(this.paper.threlte.camera)
		if (!isPerspectiveCamera(cam)) return

		// if paper is landscape, we rotate paper to portrait position (as portrait is preferable for reading/viewing/phones)
		// that's why we have to switch width and height here
		const w = this.paper.isPortrait ? this.paper.size[0] : this.paper.size[1]
		const h = this.paper.isPortrait ? this.paper.size[1] : this.paper.size[0]
		const paperAspect = w / h

		const max = Math.max(
			this.paper.threlte.renderer?.domElement.clientHeight ?? 0,
			this.paper.threlte.renderer?.domElement.clientWidth ?? 0
		)
		const margin = max < 800 ? 1.1 : 1.25

		let z = 0
		if (paperAspect <= cam.aspect) {
			// fit height
			const d = (margin * h) / (2 * Math.tan(degToRad(cam.fov / 2)))
			z = cam.position.z - d - 0.01
		} else {
			// fit width
			const d = (margin * w) / (cam.aspect * 2 * Math.tan(degToRad(cam.fov / 2)))
			z = cam.position.z - d - 0.01
		}

		return z
	}

	async select(state: AnimationState) {
		this.prevState = state

		const rotations = Math.round(state.rotationZ / (2 * Math.PI))
		const r = rotations * 2 * Math.PI
		const newRotation = !this.paper.isPortrait ? r + Math.PI / 2 : r

		this.animation.update(
			(item) => ({
				...item,
				...state,
				scale: get(this.paper.scale)
			}),
			{ duration: 0 }
		)

		await this.animation.update((item) => ({
			...item,
			x: 0,
			y: 0,
			rotationX: Math.PI,
			rotationZ: newRotation,
			z: this.getPositionZ() ?? 6.333,
			progress: 1,
			scale: 1
		}))
	}

	async deselect() {
		await this.animation.set({
			...this.prevState,
			rotationX: 0,
			progress: 0,
			z: this.paper.zIndex,
			scale: 1
		})
	}
}

export default PaperSelectAnimation
