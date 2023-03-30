import { Camera, Raycaster, Vector2, Vector3 } from 'three'
import { getUnprojectedPosition } from './getUnprojectedPosition'

const raycaster = new Raycaster()

export const findEmptySpace = (camera: Camera) => {
	const position = new Vector2()
	const topLeft = getUnprojectedPosition(new Vector3(-1, -1, 0), camera)
	const bottomRight = getUnprojectedPosition(new Vector3(1, 1, 0), camera)

	const step = 0.1
	for (let x = topLeft.x; x < bottomRight.x; x += step) {
		position.set(x, 0)
		raycaster.setFromCamera(position, camera)
	}
}
