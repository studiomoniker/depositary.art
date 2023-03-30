import * as Vibrant from 'node-vibrant'
import type { FailedValidationException as TFailedValidationException } from '@directus/shared/exceptions'
import { defineHook } from '@directus/extensions-sdk'

export default defineHook(
	({ filter, action }, { services, getSchema, database, exceptions }) => {
		async function getColoursForFile(file_id) {
			const {
				FailedValidationException,
			}: { FailedValidationException: typeof TFailedValidationException } =
				exceptions

			const schema = await getSchema()
			const { FilesService } = services
			const fileService = new FilesService({ schema, knex: database })
			const file = await fileService.readOne(file_id)

			if (!file) throw new Error(`Could not find file ${file_id}`)
			if (file.type.split('/')[0] !== 'image') {
				throw new FailedValidationException({
					message: '"image.type" must be [image/jpeg]',
					path: ['image', 'type'],
					type: 'any.only',
					context: {
						valids: ['image/jpeg'],
						label: 'image.type',
						value: file.type,
						key: 'type',
					},
				})
			}

			const palette = await Vibrant.from(
				`/directus/uploads/${file.filename_disk}`
			).getPalette()

			const colours: Record<string, [number, number, number]> = {}
			Object.keys(palette).forEach((k) => {
				if (palette[k]?.rgb) colours[k] = palette[k]!.rgb
			})
			return colours
		}

		filter('items.create', async (payload: any) => {
			if (payload.image) {
				const colours = await getColoursForFile(payload.image)
				payload.palette = colours
			}

			return payload
		})

		filter('items.update', async (payload: any) => {
			if (payload.image) {
				const colours = await getColoursForFile(payload.image)
				payload.palette = colours
			}

			return payload
		})
	}
)
