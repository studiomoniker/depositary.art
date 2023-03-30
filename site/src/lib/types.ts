import type { ArchiveBySlug$result } from '$houdini'

export type Archive = ArchiveBySlug$result['archives'][number]
export type ArchiveItem = NonNullable<
	NonNullable<ArchiveBySlug$result['archives'][number]['items']>[number]
>
