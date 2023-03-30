<script lang="ts">
	import { browser } from '$app/environment'
	import { T, useFrame } from '@threlte/core'
	import { spring, tweened } from 'svelte/motion'
	import { get } from 'svelte/store'
	import { MathUtils } from 'three'
	import { selectedPaper } from '../../store'
	import type PaperController from './PaperController'
	import PaperMesh from './PaperMesh.svelte'

	export let paper: PaperController

	let t = Math.random() * 10000
	const map = MathUtils.mapLinear
	const intensity = tweened(0, { duration: 500 })

	let speed = 1
	let rotationIntensity = 0.5
	let floatIntensity = 1
	let floatingRange: [number, number] = [-0.1, 0.1]

	$: scale = paper.scale
	$: z = paper.z
	$: rotation = paper.rotation
	$: position = paper.xy
	$: selected = $selectedPaper?.id === paper.id

	let combinedRotation = {
		y: 0,
		x: get(paper.rotation).x + (Math.cos((t / 4) * speed) / 8) * rotationIntensity * $intensity,
		z: get(paper.rotation).z + (Math.sin((t / 4) * speed) / 20) * rotationIntensity * $intensity
	}

	let combinedPosition = {
		...get(paper.xy),
		z: get(paper.z),
		y:
			get(paper.xy).y +
			map(Math.sin((t / 4) * speed) / 10, -0.1, 0.1, ...floatingRange) * floatIntensity * $intensity
	}

	// TODO: this should probably be somewhere in the PaperController
	const maxOffset = 0.25
	const rotationY = spring(0, { precision: 0.0001, stiffness: 0.05 })
	const rotationX = spring(0, { precision: 0.0001, stiffness: 0.05 })

	const updateMousePosition = (e: MouseEvent) => {
		if (!browser || !selected) return

		const x = -0.5 + e.screenX / document.body.clientWidth
		const y = -0.5 + e.screenY / document.body.clientHeight

		rotationX.set(-y * maxOffset)
		rotationY.set(x * maxOffset)
	}

	useFrame((_, delta) => {
		paper.tick()

		t += delta

		const i = $intensity
		const rotationOffsetX = (Math.cos((t / 4) * speed) / 8) * rotationIntensity * i
		const rotationOffsetY = (Math.sin((t / 4) * speed) / 13) * rotationIntensity * i
		const rotationOffsetZ = (Math.sin((t / 4) * speed) / 20) * rotationIntensity * i
		const yOffset =
			map(Math.sin((t / 4) * speed) / 10, -0.1, 0.1, ...floatingRange) * floatIntensity * i

		combinedRotation = {
			x: $rotation.x + rotationOffsetX - $rotationX,
			y: rotationOffsetY - $rotationY,
			z: $rotation.z + rotationOffsetZ
			// x: $rotation.x,
			// y: 0,
			// z: $rotation.z
		}

		combinedPosition = {
			...$position,
			z: $z,
			y: $position.y + yOffset
			// y: $position.y // disable float
		}
	})

	$: {
		if (selected) {
			intensity.set(1)
		} else {
			intensity.set(0)
			rotationY.set(0)
			rotationX.set(0)
		}
	}
</script>

<svelte:window on:mousemove={updateMousePosition} />

{#if paper.hasTexture}
	<T.Group
		position={[combinedPosition.x, combinedPosition.y, combinedPosition.z]}
		scale.y={$scale}
		scale.x={$scale}
		rotation.z={$rotation.z}
		rotation.y={combinedRotation.y}
		rotation.x={combinedRotation.x}
	>
		<PaperMesh {paper} />
	</T.Group>
{/if}
