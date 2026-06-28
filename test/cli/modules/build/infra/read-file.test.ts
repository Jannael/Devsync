import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { FileReader } from '@/modules/build/infra/read-file'
import { readFile as fsReadFile } from 'node:fs/promises'

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn(),
}))

const mockFsReadFile = fsReadFile as unknown as ReturnType<typeof vi.fn>

describe('FileReader', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reads file from path relative to cwd', async () => {
		mockFsReadFile.mockResolvedValue('hello world')

		const fileReader = new FileReader()
		await expect(fileReader.read('file.txt')).resolves.toBe('hello world')
	})
})
