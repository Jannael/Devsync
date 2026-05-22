import { describe, it, expect } from 'vitest'
import { parseDevsync } from '@devsync/core'

const MINIMAL_VALID = {
  name: 'John',
  defaultLang: 'en',
  en: { jobTitle: 'Engineer' },
}

describe('parseDevsync — custom fields', () => {
  it('accepts a custom global field at top level', () => {
    const result = parseDevsync({
      ...MINIMAL_VALID,
      department: 'Engineering',
    })
    expect((result as any).department).toBe(undefined)
  })
})

describe('parseDevsync — language structure validation', () => {
  it('accepts a language with all optional fields empty', () => {
    const result = parseDevsync({
      ...MINIMAL_VALID,
      fr: {},
    })
    expect(result.fr).toEqual({})
  })
})

describe('parseDevsync — field removal', () => {
  it('works when optional global fields are removed', () => {
    const result = parseDevsync(MINIMAL_VALID)
    expect(result.name).toBe('John')
    expect(result.defaultLang).toBe('en')
    expect(result.site).toBeUndefined()
    expect(result.socialMedia).toBeUndefined()
    expect(result.githubUserName).toBeUndefined()
  })
})
