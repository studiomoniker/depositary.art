import { selectedPaper } from './../../store'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { get } from 'svelte/store'

export function gotoItemSlug(slug: string) {
	console.log('go to item', slug)
	const archive = get(page).params.slug
	goto(`/${archive}/${slug}`)
}

export function gotoCurrentArchive() {
	if (get(selectedPaper)) return

	console.log('go to current archive')

	const archive = get(page).params.slug
	goto(`/${archive}`)
}
