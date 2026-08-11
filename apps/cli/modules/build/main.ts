import BuildCommand from '@/modules/build/app/build-command'
import { BuildCvUseCase } from '@/modules/build/app/build-cv.use-case'
import { GenerateCvUseCase } from '@/modules/build/app/generate-cv.use-case'
import { CreateAcademicsUseCase } from '@/modules/build/app/create-academics.use-case'
import { CreateGithubProfileUseCase } from '@/modules/build/app/create-github-profile.use-case'
import { CreateLinkedinUseCase } from '@/modules/build/app/create-linkedin.use-case'
import { GithubDefault } from '@/modules/build/app/github-profiles/default'
import { BuildInfrastructure } from '@/modules/build/infra/build-infrastructure'
import { MdUtils } from '@/utils/md-utils'
import { TxtUtils } from '@/utils/txt-utils'
import { HtmlUtils } from '@/utils/html-utils'
import { GithubMinimal } from '@/modules/build/app/github-profiles/minimal'
import { CreateCvTxtUseCase } from '@/modules/build/app/create-cv-txt.use-case'

export default async function build() {
	const infrastructure = new BuildInfrastructure()
	const mdUtils = new MdUtils()
	const txtUtils = new TxtUtils()
	const htmlUtils = new HtmlUtils()

	const buildCv = new BuildCvUseCase(infrastructure)
	const generateCv = new GenerateCvUseCase(infrastructure, htmlUtils)
	const createAcademics = new CreateAcademicsUseCase(infrastructure, mdUtils)
	const createLinkedin = new CreateLinkedinUseCase(infrastructure)

	const githubDefault = new GithubDefault(mdUtils)
	const githubMinimal = new GithubMinimal(mdUtils)
	const createGithubProfile = new CreateGithubProfileUseCase(infrastructure, githubDefault, githubMinimal)
	const createCvTxt = new CreateCvTxtUseCase(infrastructure, txtUtils)

	const command = new BuildCommand(infrastructure, buildCv, generateCv, createAcademics, createGithubProfile, createLinkedin, createCvTxt)

	await command.execute()
}
