import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { FileWriter } from '@/modules/build/infra/write-file'
import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

vi.mock('node:fs/promises', () => ({
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}))

const mockMkdir = mkdir as unknown as ReturnType<typeof vi.fn>
const mockWriteFile = fsWriteFile as unknown as ReturnType<typeof vi.fn>

describe('FileWriter', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('create directory and write file', async () => {
		mockMkdir.mockResolvedValue(undefined)
		mockWriteFile.mockResolvedValue(undefined)

		const fileWriter = new FileWriter()
		await fileWriter.write('output/file.txt', 'hello world')

		const fullPath = resolve(process.cwd(), 'output/file.txt')

		expect(mockMkdir).toHaveBeenCalledWith(dirname(fullPath), { recursive: true })
		expect(mockWriteFile).toHaveBeenCalledWith(fullPath, 'hello world', 'utf8')
	})

	it('resolve the path relative to cwd', async () => {
		mockMkdir.mockResolvedValue(undefined)
		mockWriteFile.mockResolvedValue(undefined)

		const fileWriter = new FileWriter()
		await fileWriter.write('some/nested/path/file.json', '{}')

		const expected = resolve(process.cwd(), 'some/nested/path/file.json')
		expect(mockWriteFile).toHaveBeenCalledWith(expected, '{}', 'utf8')
	})

	it('ServerError when mkdir fails', async () => {
		mockMkdir.mockRejectedValue(new Error('permission denied'))

		const fileWriter = new FileWriter()

		await expect(fileWriter.write('output/file.txt', 'data')).rejects.toThrow('Failed to write file')
	})

	it('ServerError when writeFile fails', async () => {
		mockMkdir.mockResolvedValue(undefined)
		mockWriteFile.mockRejectedValue(new Error('disk full'))

		const fileWriter = new FileWriter()

		await expect(fileWriter.write('output/file.txt', 'data')).rejects.toThrow('Failed to write file')
	})
})
