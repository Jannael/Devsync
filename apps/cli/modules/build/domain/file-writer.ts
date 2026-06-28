export interface IFileWriter {
	write(path: string, data: string): Promise<void>
}
