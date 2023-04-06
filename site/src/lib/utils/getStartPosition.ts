import { Camera, Vector2 } from 'three'
import { randFloat } from 'three/src/math/MathUtils'

// const getUnprojectedPosition = (position: Vector3, camera: Camera) => {
// 	position.unproject(camera);
// 	position.sub(camera.position).normalize();

// 	const targetZ = 0; // specify z position
// 	const distance = (targetZ - camera.position.z) / position.z;
// 	return new Vector3().copy(camera.position).add(position.multiplyScalar(distance));
// };

export const getStartPosition = (position: Vector2, camera: Camera) => {
	const randomPositionOnEdge = new Vector2().copy(position)
	if (position.length() === 0) randomPositionOnEdge.set(randFloat(-5, 5), randFloat(-5, 5))
	// const topLeft = getUnprojectPosition(new Vector3(-1, -1, 0), camera);
	// const bottomRight = getUnprojectPosition(new Vector3(1, 1, 0), camera);
	// const randomPositionOnEdge = new Vector2();
	// const edgeOptions = [];
	// if (position.x <= 0 && position.y <= 0) edgeOptions.push('top', 'left');
	// if (position.x > 0 && position.y < 0) edgeOptions.push('top', 'right');
	// if (position.x < 0 && position.y > 0) edgeOptions.push('bottom', 'left');
	// if (position.x > 0 && position.y > 0) edgeOptions.push('bottom', 'right');

	// const edge = sample(edgeOptions);
	// switch (edge) {
	// 	case 'top':
	// 		randomPositionOnEdge.set(randFloat(topLeft.x, bottomRight.x), topLeft.y);
	// 		break;
	// 	case 'bottom':
	// 		randomPositionOnEdge.set(randFloat(topLeft.x, bottomRight.x), bottomRight.y);
	// 		break;
	// 	case 'left':
	// 		randomPositionOnEdge.set(topLeft.x, randFloat(topLeft.y, bottomRight.y));
	// 		break;
	// 	case 'right':
	// 		randomPositionOnEdge.set(bottomRight.x, randFloat(topLeft.y, bottomRight.y));
	// 		break;
	// }

	randomPositionOnEdge.multiplyScalar(5)
	return { x: randomPositionOnEdge.x, y: randomPositionOnEdge.y }
}
