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
		md += `${devsyncTranslation.description ?? ''}\n\n`

		md += `## ${translation['Connect']}\n\n`

		for (const social of devsync.socialMedia ?? []) {
			if (social.name && social?.name.replace(/\w+/g, '').includes('github')) continue
			md += this.mdUtils.badgeWithLink({
				badge: social.mdBadge ?? '',
				link: social.url ?? '',
			})
			md += '\n'
		}

		md += '\n\n'
		md += `## ${translation['Stuff I made']}\n\n`

		for (const project of Array.isArray(devsyncTranslation?.projects) ? devsyncTranslation.projects : []) {
			md += `- [${project.name}](${project.web}): ${project.description}\n`
		}

		return md
	}
}
