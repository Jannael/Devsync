import { ZodError } from 'zod'
import { availableLangs, parseDevsync, type DevsyncPartial } from '@devsync/core'
import { DEVSYNC_JSON } from '@/constants/paths'
import { BadRequest, ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import type { IFileReader } from '@/modules/build/domain/file-reader'
import type { IDevsyncValidator } from '@/modules/build/domain/devsync-validator'

export class ValidateDevsync implements IDevsyncValidator {
	constructor(private readonly fileReader: IFileReader) {}

	async validate(): Promise<DevsyncPartial> {
		let raw: string

		try {
			raw = await this.fileReader.read(DEVSYNC_JSON)
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
}
