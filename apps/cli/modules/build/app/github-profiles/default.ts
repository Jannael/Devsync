import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { MdUtils } from '@/utils/md-utils'

export class GithubDefault {
	constructor(private readonly mdUtils: MdUtils) {}

	generate({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
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
			if (socialMedia.name && socialMedia?.name.replace(/\s+/g, '').toLowerCase().includes('github')) continue
			md += this.mdUtils.badgeWithLink({
				badge: socialMedia.mdBadge ?? '',
				link: socialMedia.url ?? '',
			})
		}

		md += this.mdUtils.badgeWithLink({
			badge: this.mdUtils.ACADEMICS_BADGE,
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
          ${(ex.list?.title?.length ?? 0) > 1 ? ex.list?.title : this.mdUtils.MD_SEPARATOR}
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
          ${(proj.list?.title?.length ?? 0) > 1 ? proj.list?.title : this.mdUtils.MD_SEPARATOR}
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
          ${(proj.list?.title?.length ?? 0) > 1 ? proj.list?.title : this.mdUtils.MD_SEPARATOR}
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
}
