import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { CreateCvTxtUseCase } from '@/modules/build/app/create-cv-txt.use-case.ts'
import { TxtUtils } from '@/utils/txt-utils.ts'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure.ts'
import type { DevsyncPartial } from '@devsync/core'

const createInfrastructureMock = () =>
	({
		readFile: vi.fn(),
		writeFile: vi.fn(),
		getHTML: vi.fn(),
		createPDF: vi.fn(),
		validateDevsync: vi.fn(),
		getDevsyncConfig: vi.fn(),
	}) as unknown as IBuildInfrastructure

const devsync: DevsyncPartial = {
	name: 'John Doe',
	email: 'john@example.com',
	phone: '+1 555 555',
	address: 'Madrid, Spain',
	site: 'https://johndoe.dev',
	githubUserName: 'johndoe',
	socialMedia: [{ name: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }],
	coreSkills: ['TypeScript'],
	en: {
		jobTitle: 'Software Engineer',
		description: 'Passionate developer',
		languages: [{ name: 'English' }, { name: 'Spanish' }],
		experience: [
			{
				position: 'Senior Dev',
				company: 'Acme',
				date: '2020 - Present',
				description: 'Building stuff',
				list: { items: [{ highlight: 'Led', description: 'migration to Bun' }] },
				skills: [{ name: 'React' }],
			},
		],
		projects: [
			{
				name: 'Devsync',
				description: 'CV generator',
				links: [{ name: 'Repo', url: 'https://github.com/jannael/devsync' }],
				skills: [{ name: 'TypeScript' }],
			},
		],
		education: [{ name: 'MIT', degree: 'CS Degree', date: '2014 - 2018' }],
		certifications: [{ name: 'AWS SA', url: 'https://aws.example.com/cert', skills: [{ name: 'AWS' }] }],
	},
}

describe('CreateCvTxtUseCase', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	it('writes the cv txt file for the given lang', async () => {
		const infrastructure = createInfrastructureMock()
		const useCase = new CreateCvTxtUseCase(infrastructure, new TxtUtils())

		await useCase.execute({ devsync, lang: 'en' })

		expect(infrastructure.writeFile).toHaveBeenCalledTimes(1)
		const [path, content] = (infrastructure.writeFile as ReturnType<typeof vi.fn>).mock.calls[0] as [string, string]
		expect(path).toContain('cv-en.txt')
		expect(content).toContain('JOHN DOE')
		expect(content).toContain('Software Engineer')
		expect(content).toContain('john@example.com')
		expect(content).toContain('LinkedIn: https://linkedin.com/in/johndoe')
		expect(content).toContain('https://github.com/johndoe')
		expect(content).toContain('Passionate developer')
		expect(content).toContain('PROFESSIONAL EXPERIENCE')
		expect(content).toContain('Senior Dev - Acme (2020 - Present)')
		expect(content).toContain('- Led: migration to Bun')
		expect(content).toContain('Devsync')
		expect(content).toContain('- Repo: https://github.com/jannael/devsync')
		expect(content).toContain('CS Degree - MIT (2014 - 2018)')
		expect(content).toContain('AWS SA: https://aws.example.com/cert')
		expect(content).toContain('TypeScript')
		expect(content).toContain('React')
		expect(content).toContain('AWS')
		expect(content).toContain('- English')
		expect(content).toContain('- Spanish')
	})

	it('writes an empty cv when lang data is missing', async () => {
		const infrastructure = createInfrastructureMock()
		const useCase = new CreateCvTxtUseCase(infrastructure, new TxtUtils())

		await useCase.execute({ devsync: {}, lang: 'en' })

		expect(infrastructure.writeFile).toHaveBeenCalledTimes(1)
	})
})
