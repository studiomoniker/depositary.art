<script lang="ts">
	import { browser } from '$app/environment'
	import { gotoCurrentArchive } from '$lib/utils/gotoHelpers'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import type { LayoutData } from '../$houdini'
	import IconButton from '../../../components/buttons/IconButton.svelte'
	import { selectedPaper } from '../../../store'

	export let data: LayoutData

	$: ({ ArchiveBySlug } = data)
	$: archive = $ArchiveBySlug.data?.archives[0]

	const flyX = browser ? Math.min(window.innerWidth, 600) : 600

	onMount(() => {
		$selectedPaper?.deselect()
		$selectedPaper = undefined
	})
</script>

<div class="about-page" transition:fly={{ x: -flyX, opacity: 1, duration: 500 }}>
	<div class="close-button">
		<IconButton type="close" inverted on:click={() => gotoCurrentArchive()} />
	</div>
	<div class="about-content">
		<h1>About</h1>
		{@html archive?.about}
	</div>
</div>
