<script lang="ts">
	import type PaperController from '../lib/Scene/PaperController'
	import IconButton from './buttons/IconButton.svelte'

	export let paper: PaperController

	$: textOpacity = paper.textOpacity

	const SIZE = 1000

	const { title, description, palette } = paper.metadata
	const vibrantColor = `rgb(${palette.Vibrant.join(' ')})`
	const lightMutedColor = `rgb(${palette.LightMuted.join(' ')})`
	const darkVibrantColor = `rgb(${palette.DarkVibrant.join(' ')})`
</script>

<div
	class="page-content"
	style="--vibrant: {vibrantColor}; --light-muted: {lightMutedColor}; --dark-muted: {darkVibrantColor}; width: {paper.isPortrait
		? paper.ratio * SIZE
		: (1 / paper.ratio) * SIZE}px; opacity: {$textOpacity}; height: {SIZE}px;"
>
	<IconButton type="close" inverted on:click={() => paper.onClick()} class="close-button" />

	<h1>{title}</h1>
	{@html description}
</div>
