<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import '../../app.scss'
	import ArchiveView from '../../components/ArchiveView.svelte'
	import IconButton from '../../components/buttons/IconButton.svelte'
	import type { LayoutData } from './$houdini'

	export let data: LayoutData

	$: ({ ArchiveBySlug } = data)
</script>

<div class="buttons">
	<IconButton type="mute" on:click={console.log} />
	<IconButton
		type="info"
		on:click={() => {
			goto(`/${$page.params.slug}/about`)
		}}
	/>
</div>

<main>
	{#if $ArchiveBySlug.fetching}
		Loading
	{:else if $ArchiveBySlug.data?.archives.length === 0}
		Archive not found
	{:else if $ArchiveBySlug.data?.archives}
		<ArchiveView archive={$ArchiveBySlug.data.archives[0]} />
	{/if}
	<slot />
</main>

<style>
	.buttons {
		position: absolute;
		z-index: var(--z-index-top);
		top: 1rem;
		right: 1rem;
	}
</style>
