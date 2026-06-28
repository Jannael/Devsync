import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import { availableLangs } from '@devsync/core'
import { runBunCommand } from '@/utils/run-bun-command'
import { GITHUB_STYLES } from '@/constants/github-profile-styles'
import { DEVSYNC_CONFIG } from '@/constants/devsync-config-fields'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'
import { BuildCvUseCase } from '@/modules/build/app/build-cv.use-case'
import { CreateAcademicsUseCase } from '@/modules/build/app/create-academics.use-case'
import { CreateGithubProfileUseCase } from '@/modules/build/app/create-github-profile.use-case'
import { CreateLinkedinUseCase } from '@/modules/build/app/create-linkedin.use-case'

export default class BuildCommand {
	constructor(
		private readonly infrastructure: IBuildInfrastructure,
		private readonly buildCv: BuildCvUseCase,
		private readonly createAcademics: CreateAcademicsUseCase,
		private readonly createGithubProfile: CreateGithubProfileUseCase,
		private readonly createLinkedin: CreateLinkedinUseCase,
	) {}

	async execute(): Promise<void> {
		try {
			console.log(`${SPACE}${GREEN('-')} Installing dependencies...`)
			await runBunCommand(['install'])
			console.log(`${SPACE}${CHECK(`${BOLD('Dependencies installed.')}`)}`)

			console.log(`${SPACE}${GREEN('-')} Building...`)
			await runBunCommand(['run', 'build'])
			console.log(`${SPACE}${CHECK(`${BOLD('Built successfully.')}`)}`)

			const devsync = await this.infrastructure.validateDevsync()
			const languages = Object.keys(devsync).filter((key) => availableLangs.includes(key as (typeof availableLangs)[number]))
			const defaultLang = devsync.defaultLang ?? 'en'

			const cvPath = await this.infrastructure.getDevsyncConfig({ field: DEVSYNC_CONFIG.pathToCompiledCV })
			const githubProfileStyle = await this.infrastructure.getDevsyncConfig({
				field: DEVSYNC_CONFIG.githubProfileStyle,
				required: false,
				defaultValue: GITHUB_STYLES.default,
			})

			for (const lang of languages) {
				await this.buildCv.execute({ name: devsync.name, lang, path: cvPath })
				await this.createLinkedin.execute({ devsync, lang })
			}

			await this.createAcademics.execute({ devsync, defaultLang })
			await this.createGithubProfile.execute({ devsync, defaultLang, style: githubProfileStyle })

			console.log(`${SPACE}${CHECK(`${BOLD('Build process completed successfully.')}`)}`)
		} catch (e) {
			errorHandler(e)
		}
	}
}
