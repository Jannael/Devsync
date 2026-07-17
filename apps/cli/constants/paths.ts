import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = typeof import.meta !== 'undefined' && import.meta.url ? resolve(fileURLToPath(import.meta.url), '..') : process.cwd()

export const PATH_CWD_PACKAGE_JSON = resolve(process.cwd(), 'package.json')
export const PATH_DEVSYNC_DIRECTORY = resolve(__dirname, '@core')
export const PATH_README = resolve(process.cwd(), 'README.md')
export const PATH_ACADEMICS = resolve(process.cwd(), 'academics', 'README.md')
export const PATH_DEVSYNC_JSON = resolve(process.cwd(), 'DEVSYNC.json')
export const PATH_DEFAULT_TEMPLATE_URL = 'https://github.com/jannael/devsync-default-template'

// Multi-language outputs
export const PATH_LINKEDIN = (lang: string) => resolve(process.cwd(), `linkedin-${lang}.md`)
export const PATH_CV_TXT = (lang: string) => resolve(process.cwd(), `cv-${lang}.txt`)
export const PATH_CV_PDF = (name: string, lang: string) => resolve(process.cwd(), 'public', `${name}-${lang}.pdf`)
export const PATH_CV_ROUTE_OUTPUT = (lang: string) => resolve(process.cwd(), 'dist', lang, 'cv', 'index.html')
