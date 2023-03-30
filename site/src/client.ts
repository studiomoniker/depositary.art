import { HoudiniClient } from '$houdini'

export default new HoudiniClient({
	url: `${import.meta.env.VITE_CMS}/graphql`,
	// for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
	fetchParams() {
		return {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`
			}
		}
	}
})
