import { type DevsyncPartial, getLangData, translations, type availableLangsType } from '@devsync/core'
import { BOLD, GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { PATH_LINKEDIN } from '@/constants/paths'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'

export class CreateLinkedinUseCase {
	constructor(private readonly infrastructure: IBuildInfrastructure) {}

	private getLinkedinSkills({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		const user = getLangData(devsync, lang)
		const skills = new Set<string>()
		const experiences = Array.isArray(user?.experience) ? user!.experience : Object.values(user?.experience ?? {})

		for (const ex of experiences) {
			for (const skill of ex.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const projects = Array.isArray(user?.projects) ? user!.projects : Object.values(user?.projects ?? {})

		for (const project of projects) {
			for (const skill of project.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}
		const certifications = Array.isArray(user?.certifications) ? user!.certifications : Object.values(user?.certifications ?? {})

		for (const cert of certifications) {
			for (const skill of cert.skills ?? []) {
				if (skill.name) {
					skills.add(skill.name)
				}
			}
		}

		return skills
	}

	private getMD({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		let md = ''
		const user = getLangData(devsync, lang)
		const translation = translations[lang as availableLangsType]

		md += `# ${user?.jobTitle ?? 'Professional Update'}\n\n`
		md += `${translation['I am']} ${devsync?.name ?? 'a software engineer'}.\n\n`

		if (user?.description) {
			md += `${user.description}\n\n`
		}

		const experiences = Array.isArray(user?.experience) ? user.experience : Object.values(user?.experience ?? {})

		if (experiences.length > 0) {
			md += `## ${translation['Professional Experience']} \n\n`

			for (const ex of experiences) {
				md += `- **${ex.position ?? 'Position'}** at **${ex.company ?? 'Company'}** (${ex.date ?? 'Date'})\n`
				if (ex.description) {
					md += ` - ${ex.description}\n`
				}

				if (ex.list?.items?.length) {
					for (const item of ex.list.items) {
						md += ` - ${item.highlight}: ${item.description}\n`
					}
				}
			}

			md += '\n'
		}

		const projects = Array.isArray(user?.projects) ? user.projects : Object.values(user?.projects ?? {})

		if (projects.length > 0) {
			md += `## ${translation['Selected projects']} \n\n`

			for (const project of projects) {
				md += `- **${project.name ?? 'Project'}**\n`
				if (project.description) {
					md += ` - ${project.description}\n`
				}

				if (project.list?.items?.length) {
					for (const item of project.list.items) {
						md += ` - ${item.highlight}: ${item.description}\n`
					}
				}

				if ((project.links?.length ?? 0) > 0) {
					md += ` - ${translation['Links']}: ${(project.links ?? []).map((link: { url: string }) => link.url).join(' | ')}\n`
				}
			}

			md += '\n'
		}

		const skills = this.getLinkedinSkills({ devsync, lang })

		if (skills.size > 0) {
			md += `## ${translation['Core Skills']} \n\n`
			md += `${Array.from(skills).join(' | ')}\n\n`
		}

		const certifications = Array.isArray(user?.certifications) ? user.certifications : Object.values(user?.certifications ?? {})

		if (certifications.length > 0) {
			md += `## ${translation['Certifications']} \n\n`
			for (const cert of certifications) {
				md += `- ${cert.name}${cert.url ? ` — ${cert.url}` : ''}\n`
			}
			md += '\n'
		}

		md += `## ${translation["Let's connect"]} \n\n`
		for (const social of devsync?.socialMedia ?? []) {
			md += `- ${social.name}: ${social.url}\n`
		}

		if (devsync?.githubUserName) {
			md += `- ${translation['Github Profile']}: https://github.com/${devsync?.githubUserName}\n`
		}

		return md
	}

	async execute({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
		console.log(`${SPACE}${GREEN('-')} Generating LinkedIn presentation...`)
		const linkedin = this.getMD({ devsync, lang })
		await this.infrastructure.writeFile(PATH_LINKEDIN(lang), linkedin)
		console.log(`${SPACE}${CHECK(`LinkedIn markdown generated at ${BOLD(PATH_LINKEDIN(lang))}`)}`)
		console.log('')
	}
}
