import { readFile as fsReadFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'
import type { IFileReader } from '@/modules/build/domain/file-reader'

export class FileReader implements IFileReader {
	async read(path: string): Promise<string> {
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
}
