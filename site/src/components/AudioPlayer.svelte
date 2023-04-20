<script lang="ts">
	import { tweened } from 'svelte/motion'
	import { interactedWithPage, preferences } from '../store'
	import { onMount } from 'svelte'

	export let audioFileId: string
	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`

	let audioEl: HTMLAudioElement | undefined = undefined
	const fadeDuration = 800
	const volumeTween = tweened(0, {
		duration: fadeDuration
	})
	let audioElMounted = false
	let canPlayThrough = false

	/**
	 * Dummy transition to keep the element in the DOM
	 */
	const transition = (_node: HTMLAudioElement) => {
		return {
			duration: fadeDuration
		}
	}

	/**
	 * The element can play through, we'll start the playback.
	 */
	const play = async () => {
		if (!audioEl) return
		await audioEl.play()
		volumeTween.set(1, { duration: fadeDuration })
	}

	$: if (audioEl) audioEl.volume = $volumeTween
	$: if ($interactedWithPage && !$preferences.muted && canPlayThrough && audioElMounted) {
		play()
		volumeTween.set(1, { duration: fadeDuration })
	} else {
		volumeTween.set(0, { duration: fadeDuration })
	}

	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

{#if mounted}
	<audio
		bind:this={audioEl}
		transition:transition
		on:introstart={() => {
			volumeTween.set(0, { duration: 0 })
			audioElMounted = true
		}}
		on:outrostart={() => {
			audioElMounted = false
		}}
		on:canplaythrough|once={() => {
			canPlayThrough = true
		}}
		src={url}
		hidden
		loop
		playsinline
		preload="auto"
	/>
{/if}
