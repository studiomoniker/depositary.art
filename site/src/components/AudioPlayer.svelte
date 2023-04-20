<script lang="ts">
	import { interactedWithPage, preferences } from '../store'

	export let audioFileId: string
	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`
</script>

{#if $interactedWithPage && !$preferences.muted && url}
	<audio
		src={url}
		style="opacity: 0.01; position: absolute; width: 0; height: 0; overflow: hidden;"
		loop
		playsinline
		preload="auto"
		autoplay
	/>
{/if}
