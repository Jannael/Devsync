import type { DevsyncPartial } from '@devsync/core'

export interface IDevsyncValidator {
	validate(): Promise<DevsyncPartial>
}
