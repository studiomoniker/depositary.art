<script lang="ts">
	import { useFrame, useThrelte } from '@threlte/core'
	import { useInteractivity } from '@threlte/extras'
	import { createEventDispatcher } from 'svelte'
	import { Mesh, Vector2, Vector3 } from 'three'

	const dispatch = createEventDispatcher<{
		change: {
			target: Vector2
			angle: number
		}
	}>()

	const { camera } = useThrelte()
	const { pointer } = useInteractivity()

	const unprojected = new Vector3()
	const mousePosition = new Vector3()
	const getMousePosition = () => {
		// mapping 2d screen space to 3d world space
		const { x: mouseX, y: mouseY } = $pointer

		const cam = camera.current

		unprojected.set(mouseX, mouseY, 0).unproject(cam)
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
