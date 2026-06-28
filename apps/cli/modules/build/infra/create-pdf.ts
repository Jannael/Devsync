import puppeteer from 'puppeteer'
import { ServerError } from '@/error/error-instance'
import { SPACE, X } from '@/utils/icons-terminal'
import type { IPdfGenerator } from '@/modules/build/domain/pdf-generator'

export class PdfGenerator implements IPdfGenerator {
	async generate(html: string, path: string): Promise<void> {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			})
			const page = await browser.newPage()
			await page.setContent(html)
			await page.emulateMediaType('screen')
			await page.pdf({
				path,
				format: 'A4',
				printBackground: true,
				margin: {
					top: '12mm',
					right: '12mm',
					bottom: '12mm',
					left: '12mm',
				},
			})
			await browser.close()
		} catch (error) {
			throw new ServerError(
				'Failed to create PDF',
				`${SPACE}${SPACE}Ensure puppeteer is properly installed.\n` +
					`${SPACE}${SPACE}Check if the system has required dependencies.` +
					`${X(String(error))}`,
			)
		}
	}
}
