<script lang="ts">
	import { createPapersFromItems, replaceBottomPaper } from '$lib/initPapers'
	import Scene from '$lib/Scene/Scene.svelte'
	import type { ArchiveItem } from '$lib/types'
	import { Canvas, type ThrelteContext } from '@threlte/core'
	import { random } from 'lodash-es'
	import { onDestroy, onMount } from 'svelte'
	import { NoToneMapping, SRGBColorSpace } from 'three'
	import { lastActivity, papers } from '../store'

	export let items: ArchiveItem[]

	let three: ThrelteContext

	let timeout: NodeJS.Timeout

	onMount(() => {
		createPapersFromItems(three, items)
	})

	const createPaperTimeout = () => {
		timeout = setTimeout(() => {
			replaceBottomPaper(three)
			createPaperTimeout()
		}, random(5000, 8000))
	}

	onDestroy(
		lastActivity.subscribe(() => {
			if (timeout) clearTimeout(timeout)
			createPaperTimeout()
		})
	)

	const cancelTimeout = () => {
		if (timeout) clearTimeout(timeout)
	}
</script>

<svelte:window on:visibilitychange={cancelTimeout} />

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
