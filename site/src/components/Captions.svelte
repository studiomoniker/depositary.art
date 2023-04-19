<script lang="ts">
	import { browser } from '$app/environment'
	import { onDestroy, onMount } from 'svelte'
	import { balancer } from 'svelte-action-balancer'
	import { fade } from 'svelte/transition'
	import { selectedPaper } from '../store'

	const PAUSE = 3000

	export let texts: { text: string }[]

	let index = 0
	let state: 'PAUSED' | 'READING' = 'PAUSED'
	let isHidden = false
	let startTime = Date.now()
	let time = 0
	let endTime = PAUSE

	$: text = texts[index].text
	$: {
		if (!!$selectedPaper) {
			isHidden = true
		} else {
			startTime = Date.now()
			isHidden = false
		}
	}

	const onVisibilityChange = () => {
		if (browser && document.visibilityState === 'visible') {
			startTime = Date.now()
			state = 'READING'
		} else {
			state = 'PAUSED'
		}
	}

	const calculateTime = (text: string) => {
		const wordCount = text.split(/\s+/).length
		const WPM = 110
		const time = (wordCount / WPM) * 60 * 1000

		return time
	}

	let raf: number
	const timer = () => {
		raf = requestAnimationFrame(timer)
		if (isHidden) return

		const now = Date.now()

		time = now - startTime

		if (time > endTime) {
			startTime = Date.now()
			time = 0

			if (state === 'PAUSED') {
				if (index >= texts.length) index = 0

				state = 'READING'
				endTime = calculateTime(texts[index].text)
			} else if (state === 'READING') {
				state = 'PAUSED'
				endTime = PAUSE
				index++
			}
		}
	}

	onMount(() => {
		timer()
	})

	onDestroy(() => {
		if (raf) cancelAnimationFrame(raf)
	})
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

<!-- <div class="timer">
	{(time / 1000).toFixed(1)} / {(endTime / 1000).toFixed(1)}
</div> -->

{#if state !== 'PAUSED'}
	<div class="captions" class:hidden={isHidden}>
		<p use:balancer={{ enabled: true, ratio: 1 }}>
			{text}
		</p>
	</div>
{/if}

<style>
	/* .timer {
		background: white;
		position: absolute;
		top: 0;
		left: 0;
	} */
</style>
