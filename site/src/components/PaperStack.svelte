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

<Canvas
	shadows={true}
	bind:ctx={three}
	colorSpace={LinearSRGBColorSpace}
	toneMapping={NoToneMapping}
>
	<Scene />
</Canvas>

<div class="debug">
	numPapers: {$papers.length}
</div>

<style>
	.debug {
		position: absolute;
		background: white;
		padding: 2px;
		bottom: 0;
		right: 0;
	}
</style>
