import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { PdfGenerator } from '@/modules/build/infra/create-pdf'

const mockLaunch = vi.fn()

vi.mock('puppeteer', () => ({
	default: {
		launch: (...args: unknown[]) => mockLaunch(...args),
	},
}))

describe('PdfGenerator', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('launches puppeteer, creates page, and generates PDF', async () => {
		const mockPage = {
			setContent: vi.fn().mockResolvedValue(undefined),
			emulateMediaType: vi.fn().mockResolvedValue(undefined),
			pdf: vi.fn().mockResolvedValue(undefined),
		}
		const mockBrowser = {
			newPage: vi.fn().mockResolvedValue(mockPage),
			close: vi.fn().mockResolvedValue(undefined),
		}
		mockLaunch.mockResolvedValue(mockBrowser)

		const pdfGenerator = new PdfGenerator()
		await pdfGenerator.generate('<h1>Test</h1>', 'output.pdf')

		expect(mockLaunch).toHaveBeenCalledTimes(1)
		expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
		expect(mockBrowser.close).toHaveBeenCalledTimes(1)
	})

	it('throws ServerError when puppeteer fails', async () => {
		mockLaunch.mockRejectedValue(new Error('Puppeteer launch failed'))

		const pdfGenerator = new PdfGenerator()

		await expect(pdfGenerator.generate('<h1>Test</h1>', 'output.pdf')).rejects.toThrow('Failed to create PDF')
	})
})
