<script lang="ts">
	import { T, useCache, useFrame, useThrelte } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import { random } from 'lodash-es'
	import { onDestroy, onMount } from 'svelte'
	import { DirectionalLight } from 'three'
	import { INITIAL_CAMERA_POSITION, INITIAL_CAMERA_ZOOM } from '../../settings'
	import { draggingPaperMesh, lastActivity, papers } from '../../store'
	import { createPapersFromItems, replaceBottomPaper } from '../initPapers'
	import type { ArchiveItem } from '../types'
	import ControlPoint from './ControlPoint.svelte'
	import NewPaper from './Paper.svelte'
	import { gotoCurrentArchive } from '../utils/gotoHelpers'

	export let items: ArchiveItem[]

	const ctx = useThrelte()
	const cache = useCache()

	let timeout: NodeJS.Timeout

	onMount(() => {
		createPapersFromItems(ctx, items, cache)
	})

	const createPaperTimeout = () => {
		timeout = setTimeout(() => {
			replaceBottomPaper(ctx, cache)
			createPaperTimeout()
		}, random(5000, 8000))
	}

	onDestroy(
		lastActivity.subscribe(() => {
			if (timeout) clearTimeout(timeout)
			createPaperTimeout()
		})
	)

	const onVisibilityChange = () => {
		if (timeout) clearTimeout(timeout)

		// @Thomas: This moved from the individual PaperController to here.
		if (document.hidden || document.visibilityState === 'hidden') {
			$papers.forEach((paper) => {
				paper.scale.update((v) => v)
			})
		}
	}

	interactivity()

	let light = new DirectionalLight()
	light.shadow.mapSize.width = 2048
	light.shadow.mapSize.height = 2048
	light.shadow.camera.near = 0.1
	light.shadow.camera.far = 100
	light.shadow.camera.left = -20
	light.shadow.camera.right = 20
	light.shadow.camera.top = 10
	light.shadow.camera.bottom = -10
	light.shadow.bias = -0.0001
	light.position.set(-3, 5, 10)
	light.castShadow = true
	light.intensity = 0.5
</script>

<svelte:window on:visibilitychange={onVisibilityChange} />

<T.PerspectiveCamera
	lookAt={{ x: 0, y: 0, z: 0 }}
	makeDefault
	position={[0, 0, 10]}
	fov={48}
	near={0.1}
	far={100}
/>

<T is={light} />
<T.AmbientLight position={[0, 10, 20]} intensity={0.8} />

{#each $papers as p (p.id)}
	<NewPaper paper={p} />
{/each}

{#if $draggingPaperMesh?.mesh}
	<ControlPoint
		mesh={$draggingPaperMesh?.mesh}
		on:change={(e) => {
			const { target, angle } = e.detail
			$draggingPaperMesh?.updateDragPosition(target.x, target.y, angle)
		}}
	/>
{/if}

<T.Mesh
	receiveShadow
	position={[0, 0, -0.15]}
	on:click={() => {
		gotoCurrentArchive(true)
	}}
>
	<T.PlaneGeometry args={[100, 100]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
