<script lang="ts">
	import { createPapersFromItems } from '$lib/initPapers'
	import Scene from '$lib/Scene/Scene.svelte'
	import type { ArchiveItem } from '$lib/types'
	import { Canvas, type ThrelteContext } from '@threlte/core'
	import { onMount } from 'svelte'
	import { NoToneMapping, SRGBColorSpace } from 'three'
	import { papers } from '../store'

	export let items: ArchiveItem[]

	let three: ThrelteContext

	onMount(() => {
		createPapersFromItems(three, items)
	})
</script>

<Canvas shadows={true} bind:ctx={three} colorSpace={SRGBColorSpace} toneMapping={NoToneMapping}>
	<Scene />
</Canvas>

<div class="debug" class:visible={import.meta.env.DEV}>
	numPapers: {$papers.length}
</div>

<style>
	.debug {
		position: absolute;
		background: white;
		padding: 2px;
		bottom: 0;
		right: 0;
		display: none;
	}

	.debug.visible {
		display: block;
	}
</style>
