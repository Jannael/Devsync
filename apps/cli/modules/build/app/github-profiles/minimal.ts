import type { MdUtils } from '@/utils/md-utils'
import { getLangData, type DevsyncPartial, translations, type availableLangsType } from '@devsync/core'

export class GithubMinimal {
	constructor(private readonly mdUtils: MdUtils) {}

	generate({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		let md = ''
		const firstName = devsync?.name?.split(' ')[0] ?? ''
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]

		md += `# ${firstName}\n\n`
		md += `${devsyncTranslation.description ?? ''}`

		md += `## ${translation['Connect']}\n\n`

		for (const social of devsync.socialMedia ?? []) {
			md += this.mdUtils.badgeWithLink({
				badge: social.mdBadge ?? '',
				link: social.url ?? '',
			})
		}

		md += `## ${translation['Stuff I made']}`

		for (const project of Array.isArray(devsyncTranslation?.projects) ? devsyncTranslation.projects : []) {
			md += `- [${project.name}](${project.web}): ${project.description}\n`
		}

		return md
	}
}
