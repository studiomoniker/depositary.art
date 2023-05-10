<script lang="ts">
	import * as detectIt from 'detect-it'
	import { onDestroy, onMount } from 'svelte'
	import type PaperController from '../lib/Scene/PaperController'
	import PaperContent from './PaperContent.svelte'
	import IconButton from './buttons/IconButton.svelte'

	export let paper: PaperController
	$: textOpacity = paper.textOpacity

	let impetus: any
	let el: HTMLDivElement

	const SIZE = 1000
	const height = SIZE
	const width = paper.isPortrait ? paper.ratio * SIZE : (1 / paper.ratio) * SIZE

	onMount(async () => {
		if (detectIt.primaryInput !== 'touch') return
		const { default: Impetus } = await import('impetus')

		impetus = new Impetus({
			boundY: [0, el.scrollHeight],
			multiplier: -2,
			source: document,
			update: function (x: number, y: number) {
				el.scrollTop = y
			}
		})
	})

	onDestroy(() => {
		impetus?.destroy()
	})
</script>

<div class="paper-wrapper" style="width: {width}px; height: {height}px;">
	<div
		class="paper-html"
		class:scrollable={detectIt.primaryInput !== 'touch' && $textOpacity > 0.7}
		bind:this={el}
	>
		<PaperContent {paper} />
	</div>

	<div class="button-container">
		<IconButton type="close" on:click={() => paper.onClick()} class="close-button" />
	</div>
</div>

<style lang="scss">
	.paper-wrapper {
		overflow: hidden;
	}

	.paper-html {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;

		&.scrollable {
			overflow: auto;
		}
	}
</style>
