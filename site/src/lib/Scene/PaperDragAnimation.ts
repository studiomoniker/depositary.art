import { spring } from 'svelte/motion'
import { get } from 'svelte/store'
import { Vector2, Vector3 } from 'three'
import type PaperController from './PaperController'
import type { RequiredPaperTransformation } from './PaperController'

const Z_ON_TOP = 1.5

class PaperDragAnimation {
	paper
	xy
	compensatedXY = { x: 0, y: 0 }
	currentPosition = new Vector3()
	preDragPosition = { x: 0, y: 0 }

	rotation = Math.random() * Math.PI
	rotationVector = new Vector2(Math.random() * Math.PI)

	targetRotation = 0
	targetRotationVector = new Vector2()

	constructor(paper: PaperController) {
		this.paper = paper
		this.xy = spring(
			{
				x: 0,
				y: 0
			},
			{
				stiffness: 0.05,
				damping: 0.6,
				precision: 0.0001
			}
		)
	}

	public tick() {
		this.tickPosition()
		this.tickRotation()
	}

	public startDrag(state: RequiredPaperTransformation) {
		const { pos, rot } = state
		const { x, y } = pos
		this.preDragPosition = { x, y }
		this.xy.set({ x, y }, { hard: true })
		this.forceRotation(rot.z)
	}

	public updatePosition(newX: number, newY: number, newAngle: number) {
		this.xy.set({
			x: newX,
			y: newY
		})
		this.targetRotation = this.targetRotation + newAngle
	}

	private tickPosition() {
		const { x, y } = get(this.xy)
		const z = get(this.paper.z)
		this.compensatePosition(x, y, z)
	}

	private compensatePosition(x: number, y: number, z: number) {
		const { zIndex, threlte } = this.paper
		this.currentPosition.set(x, y, zIndex)
		const factor = (z - zIndex) / (Z_ON_TOP - zIndex)
		this.currentPosition.lerp(get(threlte.camera).position, factor * 0.1)
		this.compensatedXY.x = this.currentPosition.x
		this.compensatedXY.y = this.currentPosition.y
	}

	private tickRotation() {
		this.targetRotationVector.set(Math.cos(this.targetRotation), Math.sin(this.targetRotation))
		this.rotationVector.lerp(this.targetRotationVector, 0.05)

		const diff = this.rotation - this.rotationVector.angle()
		if (diff === 0) return

		this.rotation = this.rotationVector.angle()
	}

	private forceRotation(z: number) {
		this.rotation = z
		this.targetRotation = z
		this.targetRotationVector.set(Math.cos(this.targetRotation), Math.sin(this.targetRotation))
		this.rotationVector = this.targetRotationVector
	}
}

export default PaperDragAnimation
