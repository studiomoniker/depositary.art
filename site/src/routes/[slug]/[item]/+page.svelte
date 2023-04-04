<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import type PaperController from '$lib/Scene/PaperController'
	import { onDestroy, onMount } from 'svelte'
	import { useInteractivity } from '@threlte/extras'
	import { clickedPaperMesh, papers, selectedPaper } from '../../../store'

	let paper: PaperController | undefined

	// onMount(() => {
	// 	paper = $papers.find((p) => p.metadata.id === $page.params.item)
	// 	if (!$clickedPaperMesh) paper?.select()
	// })

	// onDestroy(() => {
	// 	paper?.deselect()
	// })

	// afterNavigate(() => {
	// 	if (paper?.isSelected) paper.deselect()
	// 	paper = $papers.find((p) => p.metadata.id === $page.params.item)
	// 	if (!$clickedPaperMesh) paper?.select()
	// })
</script>
