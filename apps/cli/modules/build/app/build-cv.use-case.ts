import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { PATH_CV_PDF } from '@/constants/paths'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'

export class BuildCvUseCase {
	constructor(private readonly infrastructure: IBuildInfrastructure) {}

	async execute({ name = 'CV', lang, path }: { name?: string; lang: string; path: string }) {
		const CVPath = path.replace('[lang]', lang)

		console.log(`${SPACE}${GREEN('-')} Building CV and generating PDF...`)
		const html = await this.infrastructure.getHTML(CVPath)
		await this.infrastructure.createPDF(html, PATH_CV_PDF(name, lang))

		console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(PATH_CV_PDF(name, lang))}`)}`)
		console.log('')
	}
}
