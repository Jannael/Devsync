import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { academicsBadge } from '@/constants/academics-badge'
import { MdUtils } from '@/utils/md-utils'
import { MD_SEPARATOR } from '@/constants/md-separator'
import { PATH_README } from '@/constants/paths'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'

export class CreateGithubProfileUseCase {
	constructor(
		private readonly infrastructure: IBuildInfrastructure,
		private readonly mdUtils: MdUtils,
	) {}

	private createGithubProfileMd({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		let md = ''

		md += this.getHeader({ devsync, defaultLang })
		md += this.getExperienceSection({ devsync, defaultLang })
		md += this.getProjectsSection({ devsync, defaultLang })
		md += this.getOpenSourceSection({ devsync, defaultLang })

		return md
	}

	private getHeader({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		let md = ''
		md += `# ${devsyncTranslation?.jobTitle ?? 'Professional'}\n\n`
		md += `${(devsyncTranslation.status as { badge?: string } | undefined)?.badge ?? 'Active'}\n\n`
		md += `${devsyncTranslation?.description ?? ''}\n\n`

		for (const socialMedia of devsync?.socialMedia ?? []) {
			md += this.mdUtils.badgeWithLink({
				badge: socialMedia.mdBadge ?? '',
				link: socialMedia.url ?? '',
			})
		}

		md += this.mdUtils.badgeWithLink({
			badge: academicsBadge,
			link: `https://github.com/${devsync?.githubUserName ?? ''}/${devsync?.githubUserName ?? ''}/tree/main/academics`,
		})

		for (const lang of Array.isArray(devsyncTranslation?.languages) ? devsyncTranslation.languages : []) {
			md += lang.mdBadge
		}
		md += '\n\n'
		return md
	}

	private getExperienceSection({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]

		let md = ''
		md += `## ${translation['Professional Experience']} \n\n`
		md += '<table>'

		for (const ex of Array.isArray(devsyncTranslation?.experience) ? devsyncTranslation.experience : []) {
			const links = this.mdUtils.getLinks({ links: ex.links })
			const listItems = ex.list?.items ? this.mdUtils.getListItems({ items: ex.list.items }) : ''
			const skills = this.mdUtils.getSkills({ skills: ex.skills })

			md += `
      <tr>
        <td>
          <h3>${ex.company ?? 'Company'}</h3>\n
${links}
          <p>${ex.description ?? ''}</p>
          ${(ex.list?.title?.length ?? 0) > 1 ? ex.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>\n
${skills}
        </td>
        ${this.mdUtils.getTdImg({ img: ex.img ?? '', link: ex.web ?? '#', alt: ex.company ?? 'Company' })}
      </tr>`
		}
		md += '</table> \n\n'

		return md
	}

	private getProjectsSection({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]
		let md = ''
		md += `## ${translation['Projects']} \n\n`
		md += '<table>'

		for (const proj of Array.isArray(devsyncTranslation?.projects) ? devsyncTranslation.projects : []) {
			const links = this.mdUtils.getLinks({ links: proj.links })
			const listItems = proj.list?.items ? this.mdUtils.getListItems({ items: proj.list.items }) : ''
			const skills = this.mdUtils.getSkills({ skills: proj.skills })

			md += `
      <tr>
        <td>
          <h3>${proj.name ?? 'Project'}</h3>\n
${links}
          <p>${proj.description ?? ''}</p>
          ${(proj.list?.title?.length ?? 0) > 1 ? proj.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>\n
${skills}
        </td>
        ${this.mdUtils.getTdImg({ img: proj.img ?? '', link: proj.web ?? '#', alt: proj.name ?? 'Project' })}
      </tr>`
		}

		md += '</table> \n\n'

		return md
	}

	private getOpenSourceSection({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]
		let md = ''
		md += `## ${translation['Open Source']} \n\n`
		md += '<table>'

		for (const proj of Array.isArray(devsyncTranslation?.openSource) ? devsyncTranslation.openSource : []) {
			const links = this.mdUtils.getLinks({ links: proj.links })
			const listItems = proj.list?.items ? this.mdUtils.getListItems({ items: proj.list.items }) : ''
			const skills = this.mdUtils.getSkills({ skills: proj.skills })

			md += `
      <tr>
        <td>
          <h3>${proj.name ?? 'Project'}</h3>\n
${links}
          <p>${proj.description ?? ''}</p>
          ${(proj.list?.title?.length ?? 0) > 1 ? proj.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>\n
${skills}
        </td>
        ${this.mdUtils.getTdImg({ img: proj.img ?? '', link: proj.web ?? '#', alt: proj.name ?? 'Project' })}
      </tr>`
		}

		md += '</table> \n\n'

		return md
	}

	async execute({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating GitHub profile README...`)
		const README = this.createGithubProfileMd({ devsync, defaultLang })
		await this.infrastructure.writeFile(PATH_README, README)
		console.log(`${SPACE}${CHECK(`README generated at ${BOLD(PATH_README)}`)}`)
		console.log('')
	}
}
