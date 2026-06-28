import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { MD_SEPARATOR } from '@/constants/md-separator'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { ACADEMICS } from '@/constants/paths'
import { GREEN, BOLD } from '@/utils/colors'
import type { IFileWriter } from '@/modules/build/domain/file-writer'
import type { IMdUtils } from '@/modules/build/domain/md-utils'

export class CreateAcademicsUseCase {
	constructor(
		private readonly fileWriter: IFileWriter,
		private readonly mdUtils: IMdUtils,
	) {}

	private createAcademicsMd({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		let md = ''
		md += this.getEducationTimeline({ devsync, defaultLang })
		md += this.getCertifications({ devsync, defaultLang })

		return md
	}

	private getEducationTimeline({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]
		let md = ''
		md += `# ${translation['academics']} \n\n`
		md += '<table>'

		for (const ed of Array.isArray(devsyncTranslation?.education) ? devsyncTranslation.education : []) {
			const links = this.mdUtils.getLinks({ links: ed.links })
			const listItems = ed.list?.items ? this.mdUtils.getListItems({ items: ed.list.items }) : ''

			md += `
      <tr>
        <td>
          <h3>${ed.name ?? 'Name'} | ${ed.degree ?? 'Degree'} | ${ed.date ?? 'Date'}</h3>\n
${links}
          <br>
          ${(ed.list?.title?.length ?? 0) > 1 ? ed.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>
        </td>
        ${this.mdUtils.getTdImg({ img: ed.img ?? '', link: '#', alt: ed.degree ?? 'Degree' })}
      </tr>`
		}

		md += '</table> \n\n'

		return md
	}

	private getCertifications({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		const devsyncTranslation = getLangData(devsync, defaultLang)
		const translation = translations[defaultLang as availableLangsType]
		let md = ''

		md += `## ${translation['Certifications']} \n\n`
		md += '<table>'

		for (const cert of Array.isArray(devsyncTranslation?.certifications) ? devsyncTranslation.certifications : []) {
			const listItems = cert.list?.items ? this.mdUtils.getListItems({ items: cert.list.items }) : ''
			const skills = this.mdUtils.getSkills({ skills: cert.skills })

			md += `
<tr>
<td>
<h3>${cert.name ?? 'Certification'}</h3>
${(cert.list?.title?.length ?? 0) > 1 ? cert.list?.title : MD_SEPARATOR}
<ul>
  ${listItems}
</ul>
</br>\n
${skills}
</td>
<td> <a href="${cert.url ?? '#'}" target="_blank">${translation['View Certificate']}</a> </td>
</tr>`
		}

		md += '</table> \n\n'

		return md
	}

	async execute({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating academics README...`)
		const academics = this.createAcademicsMd({ devsync, defaultLang })
		await this.fileWriter.write(ACADEMICS, academics)
		console.log(`${SPACE}${CHECK(`Academics file generated at ${BOLD(ACADEMICS)}`)}`)
		console.log('')
	}
}
