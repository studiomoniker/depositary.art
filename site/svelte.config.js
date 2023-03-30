import path from 'path'
import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import seqPreprocessor from 'svelte-sequential-preprocessor'
import { preprocessThrelte } from '@threlte/preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: seqPreprocessor([
		preprocess({
			postcss: true
		}),
		preprocessThrelte()
	]),

	kit: {
		adapter: adapter(),
		alias: {
			$houdini: path.resolve('.', '$houdini')
		}
	}
}

export default config
