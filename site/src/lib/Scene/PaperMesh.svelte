<script lang="ts">
	import { InteractiveObject, T, useTexture } from '@threlte/core'
	import { HTML } from '@threlte/extras'
	import { BackSide, DoubleSide, FrontSide, Vector3, type Mesh } from 'three'
	import { PAPER_THICKNESS } from '../../settings'
	import PaperContent from '../../components/PaperContent.svelte'
	import type PaperController from './PaperController'

	export let paper: PaperController

	let mesh: Mesh

	$: opacity = paper.opacity
	$: textOpacity = paper.textOpacity

	let startPosition: Vector3 | null = null
</script>

<svelte:window
	on:pointerup={() => {
		if (paper.isDragging) paper.endDrag()
	}}
/>

<T.Mesh bind:ref={mesh} castShadow={$opacity >= 1} receiveShadow let:ref>
	<InteractiveObject
		object={ref}
		interactive
		on:pointerenter={(e) => {
			paper.onMouseOver()
		}}
		on:pointerleave={() => paper.onMouseOut()}
		on:pointerdown={(e) => {
			startPosition = new Vector3().copy(e.detail.point)
			paper.startDrag(mesh)
		}}
		on:click={(e) => {
			if (!startPosition) return
			const dist = e.detail.point.distanceTo(startPosition)
			if (dist < 0.7) paper.onClick()
		}}
	/>

	<T.BoxGeometry args={[paper.size[0], paper.size[1], PAPER_THICKNESS]} />
	<T.MeshStandardMaterial side={FrontSide} map={paper.texture} transparent opacity={$opacity} />
</T.Mesh>

{#if $opacity >= 1}
	<T.Mesh castShadow={false} receiveShadow={true} position.z={-0.004}>
		<T.PlaneGeometry args={[paper.size[0], paper.size[1]]} />
		<T.MeshStandardMaterial
			shadowSide={BackSide}
			side={DoubleSide}
			color="#aaa"
			normalMap={useTexture('/recycled/normal.jpg')}
			normalScale={1.2}
		/>
		<!-- <T.MeshPhongMaterial side={DoubleSide} shininess={60} /> -->
		{#if $textOpacity > 0}
			<HTML
				transform
				distanceFactor={1}
				rotation={{ x: Math.PI, y: 0, z: paper.isPortrait ? 0 : Math.PI / 2 }}
			>
				<PaperContent {paper} />
			</HTML>
		{/if}
	</T.Mesh>
{/if}
