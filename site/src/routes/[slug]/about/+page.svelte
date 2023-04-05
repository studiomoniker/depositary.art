<script lang="ts">
	import { gotoCurrentArchive } from '$lib/utils/gotoHelpers'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import type { LayoutData } from '../$houdini'
	import IconButton from '../../../components/buttons/IconButton.svelte'
	import { selectedPaper } from '../../../store'

	export let data: LayoutData

	$: ({ ArchiveBySlug } = data)
	$: archive = $ArchiveBySlug.data?.archives[0]

	onMount(() => {
		$selectedPaper?.deselect()
		$selectedPaper = undefined
	})
</script>

<div class="about-page" transition:fly={{ x: -600, opacity: 1, duration: 500 }}>
	<div class="close-button">
		<IconButton type="close" inverted on:click={() => gotoCurrentArchive()} />
	</div>
	<div class="about-content">
		<h1>About</h1>
		{@html archive?.about}
	</div>
</div>

<style lang="scss">
	.about-page {
		font-size: 1.25rem;
		--width: min(600px, 100%);
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: var(--width);
		z-index: calc(var(--z-index-top) - 1);
		background: black;
		color: white;
		overflow: auto;

		h1 {
			font-size: 6rem;
		}

		.close-button {
			position: absolute;
			height: 3em;
			width: 3em;
			right: 0.75em;
			top: 0.75em;
		}
	}

	.about-content {
		width: var(--width);
		padding: 2rem;
		box-sizing: border-box;
	}
</style>
