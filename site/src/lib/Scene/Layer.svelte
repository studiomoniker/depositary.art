<script lang="ts">
	import { Vector2 } from 'three'
	import { papers } from '../../store'
	import Paper from './Paper.svelte'
</script>

<!-- <svelte:window
	on:keypress={() => {
		$papers = $papers.filter((p) => p.id !== 'test');
	}}
/> -->

<!-- {#each $papers as paper}
	<Paper data={paper} />
{/each} -->

<!-- <Paper position={new Vector2(0, 0)} zIndex={0.15} size={[1, 1]} /> -->
<!-- <Paper id={'test'} position={new Vector2(5.0, 3.0)} zIndex={startZ} size={[1, 1]} /> -->
