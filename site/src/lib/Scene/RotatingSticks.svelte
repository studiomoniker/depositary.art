<script lang="ts">
	import { InteractiveObject, T } from '@threlte/core'
	import { MeshStandardMaterial, PlaneGeometry, Quaternion, Vector2, Vector3 } from 'three'

	const sticks: {
		x: number
		y: number
		q: Quaternion
	}[] = []

	const numCols = 40
	const numRows = 30

	const dX = 1.0
	const dY = 1.0

	const startX = -(numCols / 2) * dX
	const startY = -(numRows / 2) * dY

	for (let i = 0; i < numCols; i++) {
		for (let j = 0; j < numRows; j++) {
			const x = startX + i * dX
			const y = startY + j * dY

			const start = new Vector3(x, y, 0)
			const dest = new Vector3().copy(start).multiplyScalar(0.25).setZ(1.0)

			const q = new Quaternion()
			const endQ = new Quaternion().setFromUnitVectors(start, dest)
			const factor = new Vector3().distanceTo(start) / 11
			q.slerp(endQ, factor)

			console.log(factor)

			sticks.push({
				x,
				y,
				q
			})
		}
	}
</script>

<T.Line {lineMaterial} geometry={lineGeom} />

{#each sticks as stick}
	<T.Mesh
		position.x={stick.x}
		position.y={stick.y}
		quaternion={[stick.q.x, stick.q.y, stick.q.z, stick.q.w]}
		let:ref
		receiveShadow
	>
		<!-- <InteractiveObject
			object={ref}
			interactive
			on:pointerenter={() => {
				console.log(ref);
				ref.position.setX(ref.position.x + 0.5);
				// ref.quaternion.set(stick.q.x, stick.q.y, stick.q.z, stick.q.w);
			}}
		/> -->
		<T.BoxGeometry args={[0.1, 0.1, 1.0]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
{/each}
