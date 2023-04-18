<script lang="ts">
	import { browser } from '$app/environment'
	import { onDestroy, onMount } from 'svelte'
	import { balancer } from 'svelte-action-balancer'
	import { selectedPaper } from '../store'

	const PAUSE = 3000

	export let texts: { text: string }[]

	let index = 0
	let textVisible = false
	let timeout: NodeJS.Timeout

	$: text = texts[index].text
	$: paused = !!$selectedPaper

	$: {
		if (paused) {
			pause()
		} else {
			waitForReading()
		}
	}

	const pause = () => {
		if (timeout) clearTimeout(timeout)
	}

	const onVisibilityChange = () => {
		if (browser && document.visibilityState === 'visible') {
			waitForReading()
		} else {
			pause()
		}
	}

	const calculateTime = (text: string) => {
		const wordCount = text.split(/\s+/).length
		const WPM = 110
		const time = (wordCount / WPM) * 60 * 1000

		return time
	}

	const waitForPause = () => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			nextLine()
		}, PAUSE)
	}

	const waitForReading = () => {
		if (timeout) clearTimeout(timeout)

		textVisible = true
		const time = calculateTime(text)

		timeout = setTimeout(() => {
			textVisible = false
			waitForPause()
		}, time)
	}

	const nextLine = () => {
		index++
		if (index >= texts.length) index = 0
		textVisible = true
		waitForReading()
	}

	onMount(() => {
		waitForReading()
	})

	onDestroy(pause)
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

{#if textVisible}
	<div class="captions" class:paused>
		<p use:balancer={{ enabled: true, ratio: 1 }}>
			{text}
		</p>
	</div>
{/if}
