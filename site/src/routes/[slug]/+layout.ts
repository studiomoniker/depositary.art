import { get } from 'svelte/store'
import { load_ArchiveBySlug } from '$houdini'
import type { LayoutServerLoad } from '../$types'

export const load: LayoutServerLoad = async (event) => {
	const { slug } = event.params

	const { ArchiveBySlug } = await load_ArchiveBySlug({
		event,
		variables: {
			slug
		}
	})

	return {
		ArchiveBySlug: ArchiveBySlug
	}
}
