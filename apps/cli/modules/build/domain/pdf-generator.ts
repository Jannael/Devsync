export interface IPdfGenerator {
	generate(html: string, path: string): Promise<void>
}
