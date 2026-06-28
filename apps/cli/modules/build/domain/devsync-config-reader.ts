export interface IDevsyncConfigReader {
	get({ field, required, defaultValue }: { field: string; required?: boolean; defaultValue?: string }): Promise<string>
}
