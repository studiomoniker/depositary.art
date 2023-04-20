<script lang="ts">
	import { tweened } from 'svelte/motion'
	import { interactedWithPage, preferences } from '../store'

	export let audioFileId: string
	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`

	let audioEl: HTMLAudioElement | undefined = undefined
	const fadeDuration = 800
	let transitionVolume = 1
	const volumeTween = tweened(0, {
		duration: fadeDuration
	})

	/**
	 * We use a transition to fade the element out to prevent it from being removed from the DOM.
	 * We cannot use an in-transition because we have to wait for the audio to play.
	 */
	const fadeAudioOut = (_node: HTMLAudioElement) => {
		return {
			tick(t: number) {
				transitionVolume = t
			},
			duration: fadeDuration
		}
	}

	/**
	 * Reset all the values when the audio element is mounted
	 */
	const onAudioElMount = (node: HTMLAudioElement) => {
		transitionVolume = 1
		volumeTween.set(0, { duration: 0 })
	}

	/**
	 * The element can play through, we'll start the playback.
	 */
	const play = async () => {
		if (!audioEl) return
		await audioEl.play()
		volumeTween.set(1, { duration: fadeDuration })
	}

	$: combinedVolume = $volumeTween * transitionVolume
	$: if (audioEl) audioEl.volume = combinedVolume
	$: mountAudioEl = $interactedWithPage && !$preferences.muted
</script>

{#if mountAudioEl}
	<audio
		bind:this={audioEl}
		use:onAudioElMount
		out:fadeAudioOut
		on:canplaythrough|once={play}
		src={url}
		hidden
		loop
	/>
{:else}
	<!-- We'll mount this one just for the browser to start loading the source -->
	<audio hidden preload="auto" src={url} />
{/if}
