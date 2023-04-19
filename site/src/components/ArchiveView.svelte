<script lang="ts">
	import type { Archive } from '$lib/types'
	import { onDestroy, onMount } from 'svelte'
	import AudioPlayer from './AudioPlayer.svelte'
	import Captions from './Captions.svelte'
	import PaperStack from './PaperStack.svelte'

	export let archive: Archive

	let items = archive.items?.filter(Boolean) ?? []

	let showCaptions = false
	let timeout: ReturnType<typeof setTimeout> | undefined
	onMount(() => {
		timeout = setTimeout(() => {
			showCaptions = true
		}, 5000)
	})

	onDestroy(() => {
		if (timeout) clearTimeout(timeout)
	})
</script>

<svelte:head>
	<title>{archive.title}</title>
</svelte:head>

{#if showCaptions}
	<Captions texts={archive.curatorial_text} />
{/if}

<PaperStack {items} />

{#if archive.audio}
	<AudioPlayer audioFileId={archive.audio.id} />
{/if}
