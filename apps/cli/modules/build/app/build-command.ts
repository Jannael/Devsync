import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import { createCVMixin } from '@/shared/app/build-cv'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'
import { CreateLinkedinMixin } from '@/shared/app/create-linkedin'
import { getDevsyncConfigMixin } from '@/shared/infra/get-devsync-config'
import { availableLangs } from '@devsync/core'
import { runBunCommand } from '@/utils/run-bun-command'
import { GITHUB_STYLES } from '@/constants/github-profile-styles'
import { DEVSYNC_CONFIG } from '@/constants/devsync-config-fields'
/*
get defaultLang and languages from cwd
*/

class BaseUpdateCommand {}

class UpdateCommand extends CreateLinkedinMixin(
	CreateAcademicsMixin(createCVMixin(CreateGithubProfileMixin(getDevsyncConfigMixin(validateDevsyncMixin(BaseUpdateCommand))))),
) {
	constructor() {
		super()
	}

	async execute(): Promise<void> {
		try {
			console.log(`${SPACE}${GREEN('-')} Installing dependencies...`)
			await runBunCommand(['install'])
			console.log(`${SPACE}${CHECK(`${BOLD('Dependencies installed.')}`)}`)

			console.log(`${SPACE}${GREEN('-')} Building...`)
			await runBunCommand(['run', 'build'])
			console.log(`${SPACE}${CHECK(`${BOLD('Built successfully.')}`)}`)

			const devsync = await this.validateDevsync()
			const languages = Object.keys(devsync).filter((key) => availableLangs.includes(key as (typeof availableLangs)[number]))
			const defaultLang = devsync.defaultLang ?? 'en'

			const cvPath = await this.getDevsyncConfig({ field: DEVSYNC_CONFIG.pathToCompiledCV })
			const githubProfileStyle = await this.getDevsyncConfig({
				field: DEVSYNC_CONFIG.githubProfileStyle,
				required: false,
				defaultValue: GITHUB_STYLES.default,
			}) // minimal with fallback to default if not set

			await this.createAcademics({ devsync, defaultLang })

			for (const lang of languages) {
				await this.buildCV({ name: devsync.name, lang, path: cvPath })
				await this.createLinkedin({ devsync, lang })
			}

			if (githubProfileStyle === GITHUB_STYLES.default) await this.createGithubProfile({ devsync, defaultLang })

			console.log(`${SPACE}${CHECK(`${BOLD('Build process completed successfully.')}`)}`)
		} catch (e) {
			errorHandler(e)
		}
	}
}

export default UpdateCommand
