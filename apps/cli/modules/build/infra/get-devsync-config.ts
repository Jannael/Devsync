import { $ } from 'bun'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'
import type { IDevsyncConfigReader } from '@/modules/build/domain/devsync-config-reader'

export class DevsyncConfigReader implements IDevsyncConfigReader {
	async get({ field, required = true, defaultValue }: { field: string; required?: boolean; defaultValue?: string }): Promise<string> {
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
