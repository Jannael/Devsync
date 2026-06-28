import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'
import type { IFileWriter } from '@/modules/build/domain/file-writer'

export class FileWriter implements IFileWriter {
	async write(path: string, data: string): Promise<void> {
		try {
			const fullPath = resolve(process.cwd(), path)
			await mkdir(dirname(fullPath), { recursive: true })
			await fsWriteFile(fullPath, data, 'utf8')
		} catch {
			throw new ServerError(
				'Failed to write file',
				`${SPACE}${SPACE}Check if the directory is writable.\n` + `${SPACE}${SPACE}Verify you have sufficient permissions.`,
			)
		}
	}
}
