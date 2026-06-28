export interface IHtmlReader {
	read(path: string): Promise<string>
}
