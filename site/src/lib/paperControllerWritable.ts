import { writable, type Writable } from 'svelte/store'
import type PaperController from './Scene/PaperController'

/**
 * A custom Svelte store that prevents duplicate paper controllers from being added.
 */
export const paperControllerWritable = (
	...args: Parameters<typeof writable<PaperController[]>>
): Writable<PaperController[]> => {
	const store = writable<PaperController[]>(...args)

	const set: Writable<PaperController[]>['set'] = (value) => {
		// check the value for duplicates and remove them
		const unique = value.filter((item, index) => {
			return value.indexOf(item) === index
		})

		store.set(unique)
	}

	const update: Writable<PaperController[]>['update'] = (fn) => {
		store.update((paperControllers) => {
			const updated = fn(paperControllers)
			// check the value for duplicates and remove them
			const unique = updated.filter((item, index) => {
				return updated.indexOf(item) === index
			})
			return unique
		})
	}

	return {
		...store,
		set,
		update
	}
}
