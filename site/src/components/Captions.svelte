<script lang="ts">
	import { balancer } from 'svelte-action-balancer'
	import { browser } from '$app/environment'
	import { onDestroy, onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	const PAUSE = 3000

	export let texts: { text: string }[]

	let index = 0
	let textVisible = false
	let timeout: NodeJS.Timeout

	$: text = texts[index].text

	const cancel = () => {
		if (browser && document.visibilityState === 'visible') {
			waitForReading()
		} else if (timeout) {
			clearTimeout(timeout)
		}
	}

	const calculateTime = (text: string) => {
		const wordCount = text.split(/\s+/).length
		const WPM = 90
		const time = (wordCount / WPM) * 60 * 1000

		return time
	}

	const waitForReading = () => {
		textVisible = true
		const time = calculateTime(text)
		timeout = setTimeout(() => {
			textVisible = false
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

	onDestroy(cancel)
</script>

<svelte:window on:visibilitychange={cancel} />

{#if textVisible}
	<div
		transition:fade={{
			delay: PAUSE,
			duration: 0
		}}
		on:outroend={nextLine}
		class="captions"
	>
		<p use:balancer={{ enabled: true, ratio: 1 }}>
			{text}
		</p>
	</div>
{/if}
