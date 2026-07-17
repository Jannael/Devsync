import { describe, it, expect } from 'bun:test'
import { TxtUtils } from '@/utils/txt-utils.ts'

describe('TxtUtils', () => {
	const txtUtils = new TxtUtils()

	it('builds a headline with uppercased name and job title', () => {
		const headline = txtUtils.headline({ name: 'John Doe', jobTitle: 'Software Engineer' })
		expect(headline).toContain('JOHN DOE')
		expect(headline).toContain('Software Engineer')
	})

	it('builds an uppercase section header', () => {
		const section = txtUtils.section({ title: 'Professional Experience' })
		expect(section).toContain('PROFESSIONAL EXPERIENCE')
	})

	it('formats list items as bullets', () => {
		const listItems = txtUtils.getListItems({ items: [{ highlight: 'Led', description: 'migration to Bun' }] })
		expect(listItems).toContain('- Led: migration to Bun')
	})

	it('formats links as name url pairs', () => {
		const links = txtUtils.getLinks({ links: [{ name: 'Repo', url: 'https://example.com' }] })
		expect(links).toContain('- Repo: https://example.com')
	})

	it('returns empty strings when data is missing', () => {
		expect(txtUtils.getListItems({})).toBe('')
		expect(txtUtils.getLinks({ links: undefined })).toBe('')
	})
})
