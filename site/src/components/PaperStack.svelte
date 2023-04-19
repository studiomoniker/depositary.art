<script lang="ts">
	import Scene from '$lib/Scene/Scene.svelte'
	import type { ArchiveItem } from '$lib/types'
	import { Canvas } from '@threlte/core'
	import { NoToneMapping, SRGBColorSpace } from 'three'
	import { papers } from '../store'

	export let items: ArchiveItem[]
</script>

<Canvas shadows={true} colorSpace={SRGBColorSpace} toneMapping={NoToneMapping}>
	<Scene {items} />
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
