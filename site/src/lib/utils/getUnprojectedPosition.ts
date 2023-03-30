import { Vector3, type Camera } from 'three'

export const getUnprojectedPosition = (position: Vector3, camera: Camera) => {
	position.unproject(camera)
	position.sub(camera.position).normalize()

	const targetZ = 0 // specify z position
	const distance = (targetZ - camera.position.z) / position.z
	return new Vector3().copy(camera.position).add(position.multiplyScalar(distance))
}
