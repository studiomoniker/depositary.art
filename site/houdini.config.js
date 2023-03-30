/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: (env) => `${env.VITE_CMS}/graphql`,
		headers: {
			Authorization(env) {
				return `Bearer ${env.VITE_AUTH_TOKEN}`
			}
		},
		interval: 2 * 1000
		// url: 'https://countries.trevorblades.com/graphql'
	},
	plugins: {
		'houdini-svelte': {}
	}
}

export default config
