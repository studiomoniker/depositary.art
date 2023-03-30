import type PaperController from '$lib/Scene/PaperController'
import { get, writable } from 'svelte/store'
import type { Mesh } from 'three'
import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const cameraControls = writable<ThreeOrbitControls>()
export const enableOrbitControls = writable<boolean>(false)
// export const draggingPaperMesh = writable<Mesh | undefined>();
export const draggingPaperMesh = writable<PaperController | undefined>()
export const clickedPaperMesh = writable<Mesh | undefined>()
// export const draggingPaperMesh = writable<SelectedMesh | undefined>();

// export const cp = writable<ControlPoint>();
export const papers = writable<PaperController[]>([])

export const removeBottomPaper = () => {
	papers.update((items) => {
		return items.filter((p) => p.order !== 0)
	})
}

export const selectedPaper = writable<PaperController | undefined>(undefined)