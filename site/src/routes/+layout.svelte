<script lang="ts">
	import { interactedWithPage } from '../store'
</script>

<svelte:window
	on:keydown={() => {
		interactedWithPage.set(true)
	}}
	on:pointerdown={() => {
		interactedWithPage.set(true)
	}}
/>

<slot />
