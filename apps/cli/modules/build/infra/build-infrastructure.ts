import { readFile as fsReadFile, mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { $ } from 'bun'
import puppeteer from 'puppeteer'
import { ZodError } from 'zod'
import { availableLangs, parseDevsync, type DevsyncPartial } from '@devsync/core'
import { PATH_CWD_PACKAGE_JSON, PATH_DEVSYNC_JSON } from '@/constants/paths'
import { BadRequest, NotFound, ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import type { IBuildInfrastructure } from '@/modules/build/domain/build-infrastructure'

export class BuildInfrastructure implements IBuildInfrastructure {
	async readFile(path: string): Promise<string> {
		try {
			const fullPath = resolve(process.cwd(), path)
			return await fsReadFile(fullPath, 'utf8')
		} catch {
			throw new ServerError(
				'Failed to read file',
				`${SPACE}${SPACE}Check if the file exists and is accessible.\n` + `${SPACE}${SPACE}Verify file permissions.`,
			)
		}
	}

	async writeFile(path: string, data: string): Promise<void> {
		try {
			const fullPath = resolve(process.cwd(), path)
			await mkdir(dirname(fullPath), { recursive: true })
			await fsWriteFile(fullPath, data, 'utf8')
		} catch {
			throw new ServerError(
				'Failed to write file',
				`${SPACE}${SPACE}Check if the directory is writable.\n` + `${SPACE}${SPACE}Verify you have sufficient permissions.`,
			)
		}
	}

	async getHTML(path: string): Promise<string> {
		if (!existsSync(PATH_CWD_PACKAGE_JSON)) {
			throw new NotFound(
				'Package.json not found',
				`${SPACE}${SPACE}${GREEN('1.')} Run ${BOLD('devsync init')}\n` +
					`${SPACE}${SPACE}${GREEN('2.')} Fill ${BOLD('DEVSYNC.json')} with your information\n` +
					`${SPACE}${SPACE}${GREEN('3.')} Run ${BOLD('devsync build')}`,
			)
		}

		try {
			const html = await fsReadFile(path, 'utf8')
			const stylesheetRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
			const stylesheetLinks = Array.from(html.matchAll(stylesheetRegex))
			let inlinedHTML = html

			for (const linkMatch of stylesheetLinks) {
				const [linkTag, href] = linkMatch

				const cssPath = href?.startsWith('/') ? resolve(process.cwd(), 'dist', href.slice(1)) : resolve(dirname(path), href ?? '')

				const css = await fsReadFile(cssPath, 'utf8')
				inlinedHTML = inlinedHTML.replace(linkTag, `<style>${css}</style>`)
			}

			return inlinedHTML
		} catch (e) {
			console.log(e)
			throw new ServerError(
				'CV build failed',
				`${SPACE}${SPACE}Check if the build process completed successfully.\n` + `${SPACE}${SPACE}Verify that all required files exist.`,
			)
		}
	}

	async createPDF(html: string, path: string): Promise<void> {
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
					`${SPACE}${String(error)}`,
			)
		}
	}

	async validateDevsync(): Promise<DevsyncPartial> {
		let raw: string

		try {
			raw = await this.readFile(PATH_DEVSYNC_JSON)
		} catch {
			throw new ServerError(
				'Failed to read DEVSYNC.json',
				`${SPACE}${SPACE}${GREEN('1.')} Run ${BOLD('devsync init')}\n` +
					`${SPACE}${SPACE}${GREEN('2.')} Fill ${BOLD('DEVSYNC.json')} with your information\n` +
					`${SPACE}${SPACE}${GREEN('3.')} Run ${BOLD('devsync build')}`,
			)
		}

		let parsed: unknown
		try {
			parsed = JSON.parse(raw)
		} catch {
			throw new ServerError('Failed to parse DEVSYNC.json', 'DEVSYNC.json must be valid JSON before running devsync build')
		}

		try {
			const validated = parseDevsync(parsed)
			const configuredLangs = Object.keys(validated).filter((key) => availableLangs.includes(key))

			if (configuredLangs.length === 0) {
				throw new BadRequest('Invalid DEVSYNC.json structure', 'Add at least one localized object key (e.g. "en", "es") in DEVSYNC.json')
			}

			if (validated.defaultLang && !configuredLangs.includes(validated.defaultLang)) {
				throw new BadRequest('Invalid DEVSYNC.json structure', `defaultLang "${validated.defaultLang}" must exist as a localized key in DEVSYNC.json`)
			}

			return validated
		} catch (error) {
			if (error instanceof BadRequest) {
				throw error
			}

			if (error instanceof ZodError) {
				throw new BadRequest(
					'Invalid DEVSYNC.json structure',
					`Fix schema errors in DEVSYNC.json: ${error.issues[0]?.path.join('.') ?? 'unknown field'}`,
				)
			}

			throw new ServerError('Unexpected execution error')
		}
	}

	async getDevsyncConfig({ field, required = true, defaultValue }: { field: string; required?: boolean; defaultValue?: string }): Promise<string> {
		try {
			const raw = (await $`bun pm pkg get ${field}`.text()).trim().replace(/"/g, '')

			if (required && raw === '{}') throw new Error(`Field "${field}" is not set in package.json`)

			if (raw === '{}' && defaultValue !== undefined) return defaultValue

			return raw.replace(/"/g, '')
		} catch {
			throw new ServerError(
				'Failed to get devsync config',
				`${SPACE}${SPACE}Ensure the "${field}" field is set in your package.json.\n` + `${SPACE}${SPACE}Verify that your package.json is valid.`,
			)
		}
	}
}
