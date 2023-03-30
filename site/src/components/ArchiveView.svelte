<script lang="ts">
	import type { Archive } from '$lib/types'
	import PaperStack from './PaperStack.svelte'

	export let archive: Archive

	let items = archive.items?.filter(Boolean) ?? []
</script>

<svelte:head>
	<title>{archive.title}</title>
</svelte:head>

<PaperStack {items} />

<!-- {#if items}
	{#each items as item}
		{item.title}
	{/each}
{/if} -->
