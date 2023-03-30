<script lang="ts">
	import { tweened } from 'svelte/motion'
	import { onDestroy } from 'svelte'
	import { hasAudioStarted, preferences } from '../store'

	export let audioFileId: string

	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`

	let audio: HTMLAudioElement
	let volume = tweened(1, {
		duration: 500
	})

	const unsub = volume.subscribe((val) => {
		if (!audio) return
		audio.volume = val
	})

	$: {
		if ($preferences.muted) {
			volume.set(0)
		} else {
			volume.set(1)
		}
	}

	const onTouchStart = () => audio.play()
	const onPlay = () => {
		if (!$hasAudioStarted) $hasAudioStarted = true
	}

	onDestroy(unsub)
</script>

<svelte:body
	on:touchstart={onTouchStart}
	on:mousedown={onTouchStart}
	on:dragstart={onTouchStart}
	on:pointerdown={onTouchStart}
/>

<audio src={url} crossorigin="anonymous" bind:this={audio} on:play={onPlay} />
