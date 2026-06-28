import type { DevsyncPartial } from '@devsync/core'

export interface IBuildInfrastructure {
	readFile(path: string): Promise<string>
	writeFile(path: string, data: string): Promise<void>
	getHTML(path: string): Promise<string>
	createPDF(html: string, path: string): Promise<void>
	validateDevsync(): Promise<DevsyncPartial>
	getDevsyncConfig({ field, required, defaultValue }: { field: string; required?: boolean; defaultValue?: string }): Promise<string>
}
