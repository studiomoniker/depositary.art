<script lang="ts">
	import type PaperController from '$lib/Scene/PaperController'

	export let paper: PaperController

	$: textOpacity = paper.textOpacity
	const { title, description, palette } = paper.metadata
	const vibrantColor = `rgb(${palette.Vibrant.join(' ')})`
	const lightMutedColor = `rgb(${palette.LightMuted.join(' ')})`
	const darkVibrantColor = `rgb(${palette.DarkVibrant.join(' ')})`
</script>

<div
	class="paper-content"
	style="--vibrant: {vibrantColor}; --light-muted: {lightMutedColor}; --dark-muted: {darkVibrantColor}; opacity: {$textOpacity};"
>
	<h1>{title}</h1>
	{@html description}
</div>
