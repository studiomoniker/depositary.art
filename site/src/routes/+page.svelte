<script lang="ts">
	import { Canvas, type ThrelteContext } from '@threlte/core'

	import Scene from '$lib/Scene/Scene.svelte'
	import { cameraControls, enableOrbitControls, papers } from '../store'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { initPapers } from '$lib/initPapers'

	export let data: PageData
	let three: ThrelteContext

	const onKeyPress = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'KeyR':
				$cameraControls?.reset()
				break
			case 'KeyC':
				$enableOrbitControls = !$enableOrbitControls
				$cameraControls?.reset()
				break
		}
	}

	onMount(() => {
		$papers = initPapers(three)
	})
</script>

<svelte:head>
	<title>Depositary</title>
</svelte:head>

<!-- <svelte:window on:keypress={onKeyPress} /> -->

<svelte:window
	on:keypress={() => {
		// $papers = $papers.filter((p) => p.order !== 0);
		// removeBottomPaper();
	}}
/>

<Canvas flat linear shadows={true} bind:ctx={three}>
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
