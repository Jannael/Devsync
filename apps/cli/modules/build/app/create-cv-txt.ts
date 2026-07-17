import type { DevsyncPartial } from '@devsync/core'
import type { IBuildInfrastructure } from '../domain/build-infrastructure'

export class CreateCvTxt {
	constructor(private readonly infrastructure: IBuildInfrastructure) {}

	async execute({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		console.log(devsync, lang)
	}
}
