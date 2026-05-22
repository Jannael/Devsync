import devsync from '../../DEVSYNC.json'
import { parseDevsync } from './devsync-validator'
import { availableLangs } from './fields-translations'

export * from './devsync-validator'
export * from './fields-translations'

export const languages = Object.keys(devsync).filter((key) =>
  availableLangs.includes(key as (typeof availableLangs)[number])
)
export const defaultLang = devsync.defaultLang

export default parseDevsync(devsync)
