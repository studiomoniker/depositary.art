<script lang="ts">
	import { T } from '@threlte/core'
	import { interactivity } from '@threlte/extras'

	import { DirectionalLight } from 'three'
	import { INITIAL_CAMERA_POSITION, INITIAL_CAMERA_ZOOM } from '../../settings'
	import { cameraControls, draggingPaperMesh, enableOrbitControls, papers } from '../../store'
	import ControlPoint from './ControlPoint.svelte'
	import NewPaper from './Paper.svelte'

	interactivity()

	// const { pointer } = useThrelte();

	// const maxOffset = 0.05;

	// const offsetX = spring($pointer.x * maxOffset, {
	// 	precision: 0.0001,
	// 	stiffness: 0.05
	// });
	// $: offsetX.set($pointer.x * maxOffset);

	// const offsetY = spring($pointer.y * maxOffset, {
	// 	precision: 0.0001,
	// 	stiffness: 0.05
	// });
	// $: offsetY.set($pointer.y * maxOffset);

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

	let useOrtho = false
</script>

{#if useOrtho}
	<T.OrthographicCamera
		makeDefault
		position={INITIAL_CAMERA_POSITION}
		near={0.1}
		far={100}
		zoom={INITIAL_CAMERA_ZOOM}
	/>
{:else}
	<T.PerspectiveCamera
		lookAt={{ x: 0, y: 0, z: 0 }}
		makeDefault
		position={[0, 0, 10]}
		fov={48}
		near={0.1}
		far={100}
	>
		{#if $enableOrbitControls}
			<!-- <OrbitControls enableDamping bind:controls target={mesh.position} /> -->
		{/if}
	</T.PerspectiveCamera>
{/if}

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

<T.Mesh receiveShadow position={[0, 0, -0.15]}>
	<T.PlaneGeometry args={[100, 100]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
