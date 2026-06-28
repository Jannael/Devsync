import { describe, it, expect, vi, beforeEach } from 'bun:test'
import { BuildInfrastructure } from '@/modules/build/infra/build-infrastructure'
import { readFile as fsReadFile, mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

const mockLaunch = vi.fn()

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn(),
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}))

vi.mock('node:fs', () => ({
	existsSync: vi.fn(() => true),
}))

vi.mock('puppeteer', () => ({
	default: {
		launch: (...args: unknown[]) => mockLaunch(...args),
	},
}))

const mockFsReadFile = fsReadFile as unknown as ReturnType<typeof vi.fn>
const mockMkdir = mkdir as unknown as ReturnType<typeof vi.fn>
const mockWriteFile = fsWriteFile as unknown as ReturnType<typeof vi.fn>

describe('BuildInfrastructure', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('readFile', () => {
		it('reads file from path relative to cwd', async () => {
			mockFsReadFile.mockResolvedValue('hello world')

			const infrastructure = new BuildInfrastructure()
			await expect(infrastructure.readFile('file.txt')).resolves.toBe('hello world')
		})
	})

	describe('writeFile', () => {
		it('creates directory and writes file', async () => {
			mockMkdir.mockResolvedValue(undefined)
			mockWriteFile.mockResolvedValue(undefined)

			const infrastructure = new BuildInfrastructure()
			await infrastructure.writeFile('output/file.txt', 'hello world')

			const fullPath = resolve(process.cwd(), 'output/file.txt')

			expect(mockMkdir).toHaveBeenCalledWith(dirname(fullPath), { recursive: true })
			expect(mockWriteFile).toHaveBeenCalledWith(fullPath, 'hello world', 'utf8')
		})

		it('throws ServerError when write fails', async () => {
			mockMkdir.mockRejectedValue(new Error('permission denied'))

			const infrastructure = new BuildInfrastructure()
			await expect(infrastructure.writeFile('output/file.txt', 'data')).rejects.toThrow('Failed to write file')
		})
	})

	describe('getHTML', () => {
		it('reads HTML from path', async () => {
			mockFsReadFile.mockResolvedValue('<h1> DEVSYNC </h1>')

			const infrastructure = new BuildInfrastructure()
			await expect(infrastructure.getHTML('index.html')).resolves.toBe('<h1> DEVSYNC </h1>')
		})
	})

	describe('createPDF', () => {
		it('launches puppeteer and generates PDF', async () => {
			const mockPage = {
				setContent: vi.fn().mockResolvedValue(undefined),
				emulateMediaType: vi.fn().mockResolvedValue(undefined),
				pdf: vi.fn().mockResolvedValue(undefined),
			}
			const mockBrowser = {
				newPage: vi.fn().mockResolvedValue(mockPage),
				close: vi.fn().mockResolvedValue(undefined),
			}
			mockLaunch.mockResolvedValue(mockBrowser)

			const infrastructure = new BuildInfrastructure()
			await infrastructure.createPDF('<h1>Test</h1>', 'output.pdf')

			expect(mockLaunch).toHaveBeenCalledTimes(1)
			expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
			expect(mockBrowser.close).toHaveBeenCalledTimes(1)
		})

		it('throws ServerError when puppeteer fails', async () => {
			mockLaunch.mockRejectedValue(new Error('Puppeteer launch failed'))

			const infrastructure = new BuildInfrastructure()
			await expect(infrastructure.createPDF('<h1>Test</h1>', 'output.pdf')).rejects.toThrow('Failed to create PDF')
		})
	})
})
