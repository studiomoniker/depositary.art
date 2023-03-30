import glsl from 'vite-plugin-glsl'
import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [glsl(), houdini(), sveltekit()],
	ssr: {
		noExternal: ['three', 'troika-three-text']
	}
})
