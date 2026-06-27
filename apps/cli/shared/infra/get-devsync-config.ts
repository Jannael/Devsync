import { $ } from 'bun'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'

// Mixins pattern for shared infrastructure code
export function getDevsyncConfigMixin<TBase extends GConstructor>(Base: TBase) {
	return class extends Base {
		async getDevsyncConfig({ field, required = true, defaultValue }: { field: string; required?: boolean; defaultValue?: string }): Promise<string> {
			try {
				const raw = (await $`bun pm pkg get ${field}`.text()).trim().replace(/"/g, '')

				// if it's required and the field is not set, throw an error
				if (required && raw === '{}') throw new Error(`Field "${field}" is not set in package.json`)

				// if the field is not set and a default value is provided, return the default value
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
}
