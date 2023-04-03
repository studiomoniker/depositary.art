<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import type PaperController from '$lib/Scene/PaperController'
	import { onDestroy, onMount } from 'svelte'

	import { papers } from '../../../store'

	let paper: PaperController | undefined

	onMount(() => {
		paper = $papers.find((p) => p.metadata.id === $page.params.item)
		if (paper) paper.select()
	})

	onDestroy(() => {
		if (paper) paper.deselect()
	})

	afterNavigate(() => {
		if (paper) paper.deselect()
		paper = $papers.find((p) => p.metadata.id === $page.params.item)
		if (paper) paper.select()
	})
</script>
