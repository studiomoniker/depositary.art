<script lang="ts" context="module">
	const paperGeometry = new BoxGeometry(1, 1, 1)
</script>

<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import { HTML, useTexture } from '@threlte/extras'
	import { BackSide, DoubleSide, FrontSide, Vector3, type Mesh, BoxGeometry } from 'three'
	import PaperHTML from '../../components/PaperHTML.svelte'
	import { PAPER_THICKNESS, SCALE } from '../../settings'
	import type PaperController from './PaperController'

	export let paper: PaperController

	let mesh: Mesh

	const normalMap = useTexture('/recycled/normal.jpg')

	$: opacity = paper.opacity
	$: textOpacity = paper.textOpacity

	let startPosition: Vector3 | null = null
	const portal = document.querySelector('.portal')! as HTMLDivElement

	useFrame(({ renderer }) => {
		;(window as any).calls = renderer?.info.render.calls
	})
</script>

<svelte:window
	on:pointerup={() => {
		if (paper.isDragging) paper.endDrag()
	}}
/>

<T.Mesh
	dispose={false}
	bind:ref={mesh}
	castShadow={$opacity >= 1}
	receiveShadow
	on:pointerenter={(e) => {
		e.stopPropagation()
		paper.onMouseOver()
	}}
	on:pointerleave={() => paper.onMouseOut()}
	on:pointerdown={(e) => {
		e.stopPropagation()
		startPosition = new Vector3().copy(e.point)
		paper.startDrag(mesh)
	}}
	on:click={(e) => {
		e.stopPropagation()
		if (!startPosition) return
		const dist = e.point.distanceTo(startPosition)
		if (dist < 0.7) paper.onClick()
	}}
	scale={[paper.size[0], paper.size[1], PAPER_THICKNESS]}
>
	<T is={paperGeometry} />
	<T is={paper.material} opacity={$opacity} />
</T.Mesh>

{#await normalMap then value}
	{#if $opacity >= 1}
		<T.Mesh castShadow={false} receiveShadow={true} position.z={-0.004}>
			<T.PlaneGeometry args={[paper.size[0], paper.size[1]]} />
			<T.MeshStandardMaterial
				shadowSide={BackSide}
				side={DoubleSide}
				color="#dedede"
				normalMap={value}
				normalScale={1.2}
			/>
			{#if $textOpacity > 0}
				<HTML
					{portal}
					transform
					distanceFactor={1 * SCALE}
					rotation.x={Math.PI}
					rotation.z={paper.isPortrait ? 0 : Math.PI / 2}
				>
					<PaperHTML {paper} />
				</HTML>
			{/if}
		</T.Mesh>
	{/if}
{/await}
