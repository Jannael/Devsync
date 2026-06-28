import BuildCommand from '@/modules/build/app/build-command'
import { BuildCvUseCase } from '@/modules/build/app/build-cv.use-case'
import { CreateAcademicsUseCase } from '@/modules/build/app/create-academics.use-case'
import { CreateGithubProfileUseCase } from '@/modules/build/app/create-github-profile.use-case'
import { CreateLinkedinUseCase } from '@/modules/build/app/create-linkedin.use-case'
import { FileReader } from '@/modules/build/infra/read-file'
import { FileWriter } from '@/modules/build/infra/write-file'
import { HtmlReader } from '@/modules/build/infra/get-html'
import { PdfGenerator } from '@/modules/build/infra/create-pdf'
import { ValidateDevsync } from '@/modules/build/infra/validate-devsync'
import { DevsyncConfigReader } from '@/modules/build/infra/get-devsync-config'
import { MdUtils } from '@/utils/md-utils'

export default async function build() {
	const fileReader = new FileReader()
	const fileWriter = new FileWriter()
	const htmlReader = new HtmlReader()
	const pdfGenerator = new PdfGenerator()
	const mdUtils = new MdUtils()

	const devsyncValidator = new ValidateDevsync(fileReader)
	const devsyncConfigReader = new DevsyncConfigReader()

	const buildCv = new BuildCvUseCase(htmlReader, pdfGenerator)
	const createAcademics = new CreateAcademicsUseCase(fileWriter, mdUtils)
	const createGithubProfile = new CreateGithubProfileUseCase(fileWriter, mdUtils)
	const createLinkedin = new CreateLinkedinUseCase(fileWriter)

	const command = new BuildCommand(devsyncValidator, devsyncConfigReader, buildCv, createAcademics, createGithubProfile, createLinkedin)

	await command.execute()
}
