import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { GenerateCvUseCase } from '@/modules/build/app/generate-cv.use-case'
import { HtmlUtils } from '@/utils/html-utils.ts'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'
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

describe('GenerateCvUseCase', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	it('creates the cv pdf for the given lang', async () => {
		const infrastructure = createInfrastructureMock()
		const useCase = new GenerateCvUseCase(infrastructure, new HtmlUtils())

		await useCase.execute({ devsync, name: 'John Doe', lang: 'en' })

		expect(infrastructure.createPDF).toHaveBeenCalledTimes(1)
		const [html, path] = (infrastructure.createPDF as ReturnType<typeof vi.fn>).mock.calls[0] as [string, string]
		expect(path).toContain('John Doe-en.pdf')
		expect(html).toContain('John Doe')
		expect(html).toContain('Software Engineer')
		expect(html).toContain('john@example.com')
		expect(html).toContain('https://linkedin.com/in/johndoe')
		expect(html).toContain('https://github.com/johndoe')
		expect(html).toContain('Passionate developer')
		expect(html).toContain('Professional Experience')
		expect(html).toContain('Senior Dev - Acme')
		expect(html).toContain('(2020 - Present)')
		expect(html).toContain('migration to Bun')
		expect(html).toContain('Devsync')
		expect(html).toContain('https://github.com/jannael/devsync')
		expect(html).toContain('CS Degree - MIT')
		expect(html).toContain('AWS SA')
		expect(html).toContain('TypeScript')
		expect(html).toContain('React')
		expect(html).toContain('AWS')
		expect(html).toContain('English')
		expect(html).toContain('Spanish')
	})

	it('creates an empty cv when lang data is missing', async () => {
		const infrastructure = createInfrastructureMock()
		const useCase = new GenerateCvUseCase(infrastructure, new HtmlUtils())

		await useCase.execute({ devsync: {}, lang: 'en' })

		expect(infrastructure.createPDF).toHaveBeenCalledTimes(1)
	})
})
