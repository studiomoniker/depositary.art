import type { Camera, PerspectiveCamera } from 'three'

export default function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
	return (camera as PerspectiveCamera).isPerspectiveCamera === true
}
