<script lang="ts">
	import type { Archive } from '$lib/types'
	import AudioPlayer from './AudioPlayer.svelte'
	import PaperStack from './PaperStack.svelte'

	export let archive: Archive

	let items = archive.items?.filter(Boolean) ?? []
</script>

<svelte:head>
	<title>{archive.title}</title>
</svelte:head>

<PaperStack {items} />

{#if archive.audio}
	<AudioPlayer audioFileId={archive.audio.id} />
{/if}
