import type { ArchiveBySlug$result } from '$houdini'
import type PaperController from '$lib/Scene/PaperController'
import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'
import type { Mesh } from 'three'
import { paperControllerWritable } from './lib/paperControllerWritable'

export const pointer = writable({ x: 0, y: 0 })

export const draggingPaperMesh = writable<PaperController | undefined>()
export const clickedPaperMesh = writable<Mesh | undefined>()

export const papers = paperControllerWritable([])

export const removeBottomPaper = () => {
	papers.update((items) => {
		return items.filter((p) => p.order !== 0)
	})
}

export const selectedPaper = writable<PaperController | undefined>(undefined)
export const preferences = persisted('preferences', {
	muted: false
})
export const hasAudioStarted = writable<boolean>(false)

export const archiveItems = writable<
	ArchiveBySlug$result['archives'][0]['items'] | undefined | null
>(null)

export const lastActivity = writable(Date.now())

// Store whether the user interacted with the page in any way.
// Useful for determining whether to show the mute button.
export const interactedWithPage = writable(false)
