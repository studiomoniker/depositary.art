<script lang="ts">
	import { page } from '$app/stores'
	import type PaperController from '$lib/Scene/PaperController'
	import { onDestroy, onMount } from 'svelte'

	import { papers } from '../../../store'

	let paper: PaperController | undefined

	onMount(() => {
		paper = $papers.find((p) => p.metadata.id === $page.params.item)
		if (paper?.hasTexture) paper.onClick()
	})

	onDestroy(() => {
		if (paper) paper.deselect()
	})
</script>
