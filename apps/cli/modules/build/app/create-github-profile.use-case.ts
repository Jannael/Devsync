import { type DevsyncPartial } from '@devsync/core'
import { PATH_README } from '@/constants/paths'
import { GREEN, BOLD, YELLOW } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { GITHUB_STYLES } from '@/constants/github-profile-styles'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'
import { GithubDefault } from '@/modules/build/app/github-profiles/default'
import type { GithubMinimal } from './github-profiles/minimal'

export class CreateGithubProfileUseCase {
	constructor(
		private readonly infrastructure: IBuildInfrastructure,
		private readonly githubDefault: GithubDefault,
		private readonly githubMinimal: GithubMinimal,
	) {}

	async execute({ devsync, defaultLang, style }: { devsync: DevsyncPartial; defaultLang: string; style: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating GitHub profile README with style: ${BOLD(style)}...`)

		let readme: string

		if (style === GITHUB_STYLES.minimal) {
			readme = this.githubMinimal.generate({ devsync, defaultLang })
		} else {
			readme = this.githubDefault.generate({ devsync, defaultLang })
		}

		await this.infrastructure.writeFile(PATH_README, readme)
		console.log(`${SPACE}${CHECK(`README generated at ${BOLD(PATH_README)}`)}`)
		console.log('')
	}
}
