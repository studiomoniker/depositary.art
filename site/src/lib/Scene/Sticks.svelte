<script lang="ts">
	import { T } from '@threlte/core'
	import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, Vector3 } from 'three'

	const material = new LineBasicMaterial({ color: 0xffffff, vertexColors: true })

	const sticks: {
		x: number
		y: number
		geometry: BufferGeometry
	}[] = []

	const numCols = 20
	const numRows = 10

	const dX = 0.5
	const dY = 0.5

	const startX = -(numCols / 2) * dX
	const startY = -(numRows / 2) * dY

	for (let i = 0; i < numCols; i++) {
		for (let j = 0; j < numRows; j++) {
			const x = startX + i * dX
			const y = startY + j * dY

			const from = new Vector3(x, y, 0.0)
			const to = new Vector3(x * 0.9, y * 0.9, 1.0).lerp(from, 0.25)
			// const dest = new Vector3().copy(start).multiplyScalar(0.25).setZ(1.0);

			// const q = new Quaternion();
			// const endQ = new Quaternion().setFromUnitVectors(start, dest);
			// const factor = new Vector3().distanceTo(start) / 11;
			// q.slerp(endQ, factor);

			const geometry = new BufferGeometry().setFromPoints([from, to])
			geometry.setAttribute('color', new Float32BufferAttribute([1.0, 1.0, 1.0, 0.0, 0.0, 0.0], 3))

			sticks.push({
				x,
				y,
				geometry
			})
		}
	}
</script>

{#each sticks as stick}
	<T.Line {material} geometry={stick.geometry} />
	<T.Mesh position.x={stick.x} position.y={stick.y}>
		<T.CircleGeometry args={[0.05, 16]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
{/each}
