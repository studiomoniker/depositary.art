<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core'
	import { createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { Mesh, OrthographicCamera, PerspectiveCamera, Vector2, Vector3 } from 'three'
	import { pointer } from '../../store'

	const dispatch = createEventDispatcher<{
		change: {
			target: Vector2
			angle: number
		}
	}>()

	const { camera } = useThrelte()

	// function isPerspectiveCamera(
	// 	camera: PerspectiveCamera | OrthographicCamera
	// ): camera is PerspectiveCamera {
	// 	return (camera as PerspectiveCamera).isPerspectiveCamera === true;
	// }

	const unprojected = new Vector3()
	const mousePosition = new Vector3()
	const getMousePosition = () => {
		// mapping 2d screen space to 3d world space
		const { x: mouseX, y: mouseY } = $pointer
		const normalizedMouse = { x: -1 + mouseX * 2, y: 1 - mouseY * 2 }

		const cam = get(camera) as PerspectiveCamera | OrthographicCamera

		unprojected.set(normalizedMouse.x, normalizedMouse.y, 0).unproject(cam)
		unprojected.sub(cam.position).normalize()

		const targetZ = 0 // specify z position
		const distance = (targetZ - cam.position.z) / unprojected.z
		mousePosition.copy(cam.position).add(unprojected.multiplyScalar(distance))

		return mousePosition
	}

	// get world position of mesh
	const getMeshPosition = () => {
		const pos = new Vector3()
		mesh.getWorldPosition(pos)
		return pos
	}

	const calculateValues = () => {
		const mouse = getMousePosition()
		const meshPosition = getMeshPosition()
		const dx = mouse.x - meshPosition.x
		const dy = mouse.y - meshPosition.y
		const dist = new Vector2(mouse.x, mouse.y).distanceTo(
			new Vector2(meshPosition.x, meshPosition.y)
		)

		const angle = Math.atan2(dy, dx)
		const x = mouse.x - Math.cos(angle) * dist
		const y = mouse.y - Math.sin(angle) * dist

		return {
			angle,
			dist,
			x,
			y
		}
	}

	export let mesh: Mesh

	const values = calculateValues()
	let position = new Vector2(values.x, values.y)
	let startAngle: number = values.angle
	let angle = startAngle
	let size = values.dist

	useFrame(() => {
		const mouse = getMousePosition()
		const dx = mouse.x - position.x
		const dy = mouse.y - position.y

		angle = Math.atan2(dy, dx)
		position.x = mouse.x - Math.cos(angle) * size
		position.y = mouse.y - Math.sin(angle) * size

		const angleDiff = angle - startAngle
		startAngle = angle

		dispatch('change', {
			target: position,
			angle: angleDiff
		})
	})
</script>

<!-- <T.Mesh position={[position.x, position.y, 1.6]} rotation.z={angle}>
	<T.PlaneGeometry args={[0.2, 0.2]} />
	<T.MeshStandardMaterial color="purple" />
</T.Mesh> -->
