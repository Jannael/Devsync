import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { HtmlReader } from '@/modules/build/infra/get-html'
import { readFile as fsReadFile } from 'node:fs/promises'

vi.mock('@/constants/paths', () => ({
	CWD_PACKAGE_JSON: '/mock/package.json',
}))

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn(),
}))

vi.mock('node:fs', () => ({
	existsSync: vi.fn(() => true),
}))

const mockFsReadFile = fsReadFile as unknown as ReturnType<typeof vi.fn>

describe('HtmlReader', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reads HTML from path', async () => {
		mockFsReadFile.mockResolvedValue('<h1> DEVSYNC </h1>')

		const htmlReader = new HtmlReader()
		await expect(htmlReader.read('index.html')).resolves.toBe('<h1> DEVSYNC </h1>')
	})
})
