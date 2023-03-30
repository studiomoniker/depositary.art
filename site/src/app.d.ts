// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: {
			username: string
			email: string
			createdAt: string
			token: string
		} | null
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare module 'svelte-feathers'

declare module '*.frag'
