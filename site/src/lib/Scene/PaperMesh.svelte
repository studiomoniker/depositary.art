<script lang="ts">
	import { T } from '@threlte/core'
	import { HTML, useTexture } from '@threlte/extras'
	import { BackSide, DoubleSide, FrontSide, Vector3, type Mesh } from 'three'
	import PaperHTML from '../../components/PaperHTML.svelte'
	import { PAPER_THICKNESS } from '../../settings'
	import type PaperController from './PaperController'

	export let paper: PaperController

	let mesh: Mesh

	const normalMap = useTexture('/recycled/normal.jpg')

	$: opacity = paper.opacity
	$: textOpacity = paper.textOpacity

	let startPosition: Vector3 | null = null
</script>

<svelte:window
	on:pointerup={() => {
		if (paper.isDragging) paper.endDrag()
	}}
/>

<T.Mesh
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
>
	<T.BoxGeometry args={[paper.size[0], paper.size[1], PAPER_THICKNESS]} />
	<T.MeshStandardMaterial side={FrontSide} map={paper.texture} transparent opacity={$opacity} />
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
			<!-- <T.MeshPhongMaterial side={DoubleSide} shininess={60} /> -->
			{#if $textOpacity > 0}
				<HTML
					transform
					distanceFactor={1}
					rotation.x={Math.PI}
					rotation.z={paper.isPortrait ? 0 : Math.PI / 2}
				>
					<PaperHTML {paper} />
				</HTML>
			{/if}
		</T.Mesh>
	{/if}
{/await}
