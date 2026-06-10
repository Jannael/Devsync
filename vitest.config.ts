import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './apps/cli'),
			'@devsync/core': resolve(__dirname, './apps/@core/src/devsync/devsync'),
		},
	},
	test: {
		environment: 'node',
		include: ['**/*.test.ts', '**/*.spec.ts'],
	},
})
