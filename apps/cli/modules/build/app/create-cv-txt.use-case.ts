import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { BOLD, GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { PATH_CV_TXT } from '@/constants/paths'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'
import type { TxtUtils } from '@/utils/txt-utils'

export class CreateCvTxtUseCase {
	constructor(
		private readonly infrastructure: IBuildInfrastructure,
		private readonly txtUtils: TxtUtils,
	) {}

	private getCvSkills({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		const translation = getLangData(devsync, lang)
		const skills = new Set<string>(devsync?.coreSkills ?? [])

		const experiences = Array.isArray(translation?.experience) ? translation.experience : Object.values(translation?.experience ?? {})

		for (const ex of experiences) {
			for (const skill of ex.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const projects = Array.isArray(translation?.projects) ? translation.projects : Object.values(translation?.projects ?? {})

		for (const project of projects) {
			for (const skill of project.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const certifications = Array.isArray(translation?.certifications) ? translation.certifications : Object.values(translation?.certifications ?? {})

		for (const cert of certifications) {
			for (const skill of cert.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}

		return skills
	}

	private getTxt({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		let txt = ''
		const translation = getLangData(devsync, lang)
		const innerTranslation = translations[lang as availableLangsType]

		txt += this.txtUtils.headline({ name: devsync?.name, jobTitle: translation?.jobTitle as string | undefined })

		const contact = [devsync?.email, devsync?.phone, devsync?.address, devsync?.site].filter(Boolean).join(' | ')

		if (contact) {
			txt += `\n${contact}\n`
		}

		for (const social of devsync?.socialMedia ?? []) {
			if (social?.name && social?.url) {
				txt += `${social.name}: ${social.url}\n`
			}
		}

		if (devsync?.githubUserName) {
			txt += `${innerTranslation['Github Profile']}: https://github.com/${devsync.githubUserName}\n`
		}

		if (translation?.description) {
			txt += this.txtUtils.section({ title: innerTranslation.Description })
			txt += `${translation.description}\n`
		}

		const experiences = Array.isArray(translation?.experience) ? translation.experience : Object.values(translation?.experience ?? {})

		if (experiences.length > 0) {
			txt += this.txtUtils.section({ title: innerTranslation['Professional Experience'] })

			for (const ex of experiences) {
				txt += `\n${ex.position ?? 'Position'} - ${ex.company ?? 'Company'} (${ex.date ?? 'Date'})\n`
				if (ex.description) {
					txt += `  ${ex.description}\n`
				}
				txt += this.txtUtils.getListItems({ items: ex.list?.items })
			}
		}

		const projects = Array.isArray(translation?.projects) ? translation.projects : Object.values(translation?.projects ?? {})

		if (projects.length > 0) {
			txt += this.txtUtils.section({ title: innerTranslation.Projects })

			for (const project of projects) {
				txt += `\n${project.name ?? 'Project'}\n`
				if (project.description) {
					txt += `  ${project.description}\n`
				}
				txt += this.txtUtils.getListItems({ items: project.list?.items })
				txt += this.txtUtils.getLinks({ links: project.links })
			}
		}

		const education = Array.isArray(translation?.education) ? translation.education : Object.values(translation?.education ?? {})

		if (education.length > 0) {
			txt += this.txtUtils.section({ title: innerTranslation.Education })

			for (const edu of education) {
				txt += `\n${edu.degree ?? 'Degree'} - ${edu.name ?? 'Institution'} (${edu.date ?? 'Date'})\n`
				txt += this.txtUtils.getListItems({ items: edu.list?.items })
			}
		}

		const certifications = Array.isArray(translation?.certifications) ? translation.certifications : Object.values(translation?.certifications ?? {})

		if (certifications.length > 0) {
			txt += this.txtUtils.section({ title: innerTranslation.Certifications })
			for (const cert of certifications) {
				txt += `  - ${cert.name ?? ''}${cert.url ? `: ${cert.url}` : ''}\n`
			}
		}

		const skills = this.getCvSkills({ devsync, lang })

		if (skills.size > 0) {
			txt += this.txtUtils.section({ title: innerTranslation['Core Skills'] })
			txt += `${Array.from(skills).join(' | ')}\n`
		}

		const languages = Array.isArray(translation?.languages) ? translation.languages : Object.values(translation?.languages ?? {})

		if (languages.length > 0) {
			txt += this.txtUtils.section({ title: innerTranslation.Languages })
			for (const language of languages) {
				if (language?.name) {
					txt += `  - ${language.name}\n`
				}
			}
		}

		return txt
	}

	async execute({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating CV txt...`)
		const cvTxt = this.getTxt({ devsync, lang })
		await this.infrastructure.writeFile(PATH_CV_TXT(lang), cvTxt)
		console.log(`${SPACE}${CHECK(`CV txt generated at ${BOLD(PATH_CV_TXT(lang))}`)}`)
		console.log('')
	}
}
