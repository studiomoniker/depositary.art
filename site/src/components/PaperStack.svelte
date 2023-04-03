<script lang="ts">
	import { Canvas, type ThrelteContext } from '@threlte/core'
	import { LinearSRGBColorSpace, NoToneMapping } from 'three'
	import { createPapersFromItems } from '$lib/initPapers'
	import Scene from '$lib/Scene/Scene.svelte'
	import type { ArchiveItem } from '$lib/types'
	import { onMount } from 'svelte'
	import { papers } from '../store'

	export let items: ArchiveItem[]

	let three: ThrelteContext

	onMount(() => {
		$papers = createPapersFromItems(three, items)
	})
</script>

<div class="canvas-container">
	<Canvas
		shadows={true}
		bind:ctx={three}
		colorSpace={LinearSRGBColorSpace}
		toneMapping={NoToneMapping}
	>
		<Scene />
	</Canvas>
</div>

<div class="debug">
	numPapers: {$papers.length}
</div>

<style>
	.canvas-container {
		height: 100%;
		width: 100%;
		user-select: none;
	}

	.debug {
		position: absolute;
		background: white;
		padding: 2px;
		bottom: 0;
		right: 0;
	}
</style>
