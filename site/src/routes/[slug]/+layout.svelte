<script lang="ts">
	import '../../app.scss'

	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import ArchiveView from '../../components/ArchiveView.svelte'
	import IconButton from '../../components/buttons/IconButton.svelte'
	import { archiveItems, interactedWithPage, lastActivity, pointer, preferences } from '../../store'
	import type { LayoutData } from './$houdini'
	import type { ArchiveBySlug$result } from '$houdini'
	import { gotoCurrentArchive } from '../../lib/utils/gotoHelpers'

	export let data: LayoutData

	$: ({ ArchiveBySlug } = data)
	$: updateArchiveItemsStore($ArchiveBySlug.data)

	const updateArchiveItemsStore = (data: ArchiveBySlug$result | null) => {
		if (!browser) return
		let items = null
		if (data?.archives?.[0]?.items) {
			items = data.archives[0].items
		}
		$archiveItems = items
	}

	const toggleMute = () => ($preferences.muted = !$preferences.muted)

	const updateMousePosition = (e: MouseEvent) => {
		if (!browser) return
		updateActivity()

		// x: left to right, 0 - 1
		// y: top to bottom, 0 - 1
		const x = e.clientX / document.body.clientWidth
		const y = e.clientY / document.body.clientHeight

		$pointer = { x, y }
	}

	const updateActivity = () => ($lastActivity = Date.now())
</script>

<svelte:window on:pointermove={updateMousePosition} on:pointerdown={updateActivity} />

<div class="buttons">
	<IconButton
		type={$preferences.muted ? 'unmute' : 'mute'}
		on:click={toggleMute}
		class={$interactedWithPage ? '' : 'hidden'}
	/>
	<IconButton
		type="info"
		on:click={() => {
			if ($page.route.id?.includes('about')) {
				gotoCurrentArchive()
			} else {
				goto(`/${$page.params.slug}/about`)
			}
		}}
	/>
</div>

<div class="portal" />

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
