import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { BOLD, GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { PATH_CV_PDF } from '@/constants/paths'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'
import type { HtmlUtils } from '@/utils/html-utils'

export class GenerateCvUseCase {
	constructor(
		private readonly infrastructure: IBuildInfrastructure,
		private readonly htmlUtils: HtmlUtils,
	) {}

	private getCvSkills({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		const user = getLangData(devsync, lang)
		const skills = new Set<string>(devsync?.coreSkills ?? [])

		const experiences = Array.isArray(user?.experience) ? user.experience : Object.values(user?.experience ?? {})

		for (const ex of experiences) {
			for (const skill of ex.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const projects = Array.isArray(user?.projects) ? user.projects : Object.values(user?.projects ?? {})

		for (const project of projects) {
			for (const skill of project.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const certifications = Array.isArray(user?.certifications) ? user.certifications : Object.values(user?.certifications ?? {})

		for (const cert of certifications) {
			for (const skill of cert.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}

		return skills
	}

	private getHtml({ devsync, name, lang }: { devsync: DevsyncPartial; name: string; lang: string }) {
		let body = ''
		const user = getLangData(devsync, lang)
		const translation = translations[lang as availableLangsType]

		body += this.htmlUtils.headline({ name: devsync?.name, jobTitle: user?.jobTitle as string | undefined })

		const contact = [devsync?.email, devsync?.phone, devsync?.address, devsync?.site]

		const socials = (devsync?.socialMedia ?? [])
			.filter((social) => social?.name && social?.url && !social.name.replace(/\s+/g, '').toLowerCase().includes('github'))
			.map((social) => `<a href="${social.url}" target="_blank" rel="noopener noreferrer">${social.name}</a>`)

		if (devsync?.githubUserName) {
			socials.push(
				`<a href="https://github.com/${devsync.githubUserName}" target="_blank" rel="noopener noreferrer">${translation['Github Profile']}</a>`,
			)
		}

		body += this.htmlUtils.contactLine({ items: [...contact, ...socials] })

		if (user?.description && typeof user.description === 'string') {
			body += this.htmlUtils.section({ title: translation.Description, content: this.htmlUtils.paragraph({ text: user.description }) })
		}

		const experiences = Array.isArray(user?.experience) ? user.experience : Object.values(user?.experience ?? {})

		if (experiences.length > 0) {
			let content = ''
			for (const ex of experiences) {
				content += this.htmlUtils.entryHeader({ title: ex.position ?? 'Position', subtitle: ex.company ?? 'Company', date: ex.date ?? 'Date' })
				if (ex.description) {
					content += this.htmlUtils.paragraph({ text: ex.description })
				}
				content += this.htmlUtils.getListItems({ items: ex.list?.items })
			}
			body += this.htmlUtils.section({ title: translation['Professional Experience'], content })
		}

		const projects = Array.isArray(user?.projects) ? user.projects : Object.values(user?.projects ?? {})

		if (projects.length > 0) {
			let content = ''
			for (const project of projects) {
				content += this.htmlUtils.entryHeader({ title: project.name ?? 'Project' })
				if (project.description) {
					content += this.htmlUtils.paragraph({ text: project.description })
				}
				content += this.htmlUtils.getListItems({ items: project.list?.items })
				content += this.htmlUtils.getLinks({ links: project.links })
			}
			body += this.htmlUtils.section({ title: translation.Projects, content })
		}

		const education = Array.isArray(user?.education) ? user.education : Object.values(user?.education ?? {})

		if (education.length > 0) {
			let content = ''
			for (const edu of education) {
				content += this.htmlUtils.entryHeader({ title: edu.degree ?? 'Degree', subtitle: edu.name ?? 'Institution', date: edu.date ?? 'Date' })
				content += this.htmlUtils.getListItems({ items: edu.list?.items })
			}
			body += this.htmlUtils.section({ title: translation.Education, content })
		}

		const certifications = Array.isArray(user?.certifications) ? user.certifications : Object.values(user?.certifications ?? {})

		if (certifications.length > 0) {
			body += this.htmlUtils.section({ title: translation.Certifications, content: this.htmlUtils.getLinks({ links: certifications }) })
		}

		const skills = this.getCvSkills({ devsync, lang })

		if (skills.size > 0) {
			body += this.htmlUtils.section({
				title: translation['Core Skills'],
				content: this.htmlUtils.paragraph({ text: Array.from(skills).join(' | ') }),
			})
		}

		const languages = Array.isArray(user?.languages) ? user.languages : Object.values(user?.languages ?? {})

		if (languages.length > 0) {
			body += this.htmlUtils.section({
				title: translation.Languages,
				content: this.htmlUtils.getTextList({ items: languages.map((language) => language?.name) }),
			})
		}

		return this.htmlUtils.document({ lang, title: `${name} - CV`, body })
	}

	async execute({ devsync, name = 'CV', lang }: { devsync: DevsyncPartial; name?: string; lang: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating CV...`)
		const html = this.getHtml({ devsync, name, lang })
		await this.infrastructure.createPDF(html, PATH_CV_PDF(name, lang))
		console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(PATH_CV_PDF(name, lang))}`)}`)
		console.log('')
	}
}
