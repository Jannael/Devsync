import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { CV_PDF } from '@/constants/paths'
import type { IHtmlReader } from '@/modules/build/domain/html-reader'
import type { IPdfGenerator } from '@/modules/build/domain/pdf-generator'

export class BuildCvUseCase {
	constructor(
		private readonly htmlReader: IHtmlReader,
		private readonly pdfGenerator: IPdfGenerator,
	) {}

	async execute({ name = 'CV', lang, path }: { name?: string; lang: string; path: string }) {
		const CVPath = path.replace('[lang]', lang)

		console.log(`${SPACE}${GREEN('-')} Building CV and generating PDF...`)
		const html = await this.htmlReader.read(CVPath)
		await this.pdfGenerator.generate(html, CV_PDF(name, lang))

		console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(CV_PDF(name, lang))}`)}`)
		console.log('')
	}
}
