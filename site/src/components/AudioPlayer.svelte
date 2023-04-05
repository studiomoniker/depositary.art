<script lang="ts">
	import { Howl } from 'howler'
	import { hasAudioStarted, preferences } from '../store'

	export let audioFileId: string
	const url = `${import.meta.env.VITE_CMS}/assets/${audioFileId}?access_token=${
		import.meta.env.VITE_AUTH_TOKEN
	}`

	Howler.autoUnlock = true

	const sound: Howl = new Howl({
		src: [url],
		html5: false,
		loop: true,
		preload: true,
		volume: $preferences.muted ? 0 : 1,
		format: 'mp3',
		onunlock: () => sound.play(),
		onplay: () => ($hasAudioStarted = true)
	})

	$: {
		if ($preferences.muted) {
			sound.fade(sound.volume(), 0, 500)
		} else {
			sound.fade(sound.volume(), 1, 500)
		}
	}
</script>
