import { get } from 'svelte/store'
import { load_Homepage } from '$houdini'
import { redirect, error } from '@sveltejs/kit'

export async function load(event) {
	const { Homepage } = await load_Homepage({ event })

	const { data } = get(Homepage)
	if (!data) error('Could not load homepage data')

	throw redirect(302, `/${data?.homepage?.archive?.slug}`)
	return { Homepage }
}
