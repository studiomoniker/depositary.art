<script lang="ts">
	import { interactedWithPage, preferences } from '../store'

	export let audioFileId: string
	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`

	let audioElement: HTMLAudioElement | undefined = undefined
	$: if ($interactedWithPage && !$preferences.muted) {
		audioElement?.play()
	} else {
		audioElement?.pause()
	}
</script>

<audio
	src={url}
	bind:this={audioElement}
	style="opacity: 0.01; position: absolute; width: 0; height: 0; overflow: hidden;"
	loop
	playsinline
	preload="auto"
/>
