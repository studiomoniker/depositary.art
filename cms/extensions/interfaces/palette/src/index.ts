import { defineInterface } from '@directus/extensions-sdk'
import InterfaceComponent from './interface.vue'

console.log('interface')

export default defineInterface({
	id: 'palette',
	name: 'Palette',
	icon: 'palette',
	description: 'Displays Vibrant palette of image',
	component: InterfaceComponent,
	options: null,
	types: ['json', 'text'],
})
