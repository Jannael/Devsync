import BuildCommand from '@/modules/build/app/build-command'
import { BuildCvUseCase } from '@/modules/build/app/build-cv.use-case'
import { CreateAcademicsUseCase } from '@/modules/build/app/create-academics.use-case'
import { CreateGithubProfileUseCase } from '@/modules/build/app/create-github-profile.use-case'
import { CreateLinkedinUseCase } from '@/modules/build/app/create-linkedin.use-case'
import { GithubDefault } from '@/modules/build/app/github-profiles/default'
import { BuildInfrastructure } from '@/modules/build/infra/build-infrastructure'
import { MdUtils } from '@/utils/md-utils'
import { GithubMinimal } from '@/modules/build/app/github-profiles/minimal'

export default async function build() {
	const infrastructure = new BuildInfrastructure()
	const mdUtils = new MdUtils()

	const buildCv = new BuildCvUseCase(infrastructure)
	const createAcademics = new CreateAcademicsUseCase(infrastructure, mdUtils)
	const githubDefault = new GithubDefault(mdUtils)
	const githubMinimal = new GithubMinimal(mdUtils)
	const createGithubProfile = new CreateGithubProfileUseCase(infrastructure, githubDefault, githubMinimal)
	const createLinkedin = new CreateLinkedinUseCase(infrastructure)

	const command = new BuildCommand(infrastructure, buildCv, createAcademics, createGithubProfile, createLinkedin)

	await command.execute()
}
