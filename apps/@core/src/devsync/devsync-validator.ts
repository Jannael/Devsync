import { z } from 'zod'

const languageSchema = z
  .object({
    name: z.string({ message: 'Language name is required' }),
    mdBadge: z.string({ message: 'Markdown badge is required' }),
    icon: z.string({ message: 'Icon is required' }),
  })
  .partial()

const linkSchema = z
  .object({
    name: z.string({ message: 'Link name is required' }),
    url: z.string({ message: 'URL is required' }),
    mdBadge: z.string({ message: 'Markdown badge is required' }),
    icon: z.string({ message: 'Icon is required' }),
  })
  .partial()

const skillsSchema = z
  .object({
    name: z.string({ message: 'Skill name is required' }),
    mdBadge: z.string({ message: 'Markdown badge is required' }),
    icon: z.string({ message: 'Icon is required' }),
  })
  .partial()

const ListSchema = z
  .object({
    title: z.string({ message: 'List title is required' }),
    items: z.array(
      z.object({
        highlight: z.string({ message: 'Highlight is required' }),
        description: z.string({ message: 'Description is required' }),
      })
    ),
  })
  .partial()

const experienceSchema = z
  .object({
    company: z.string({ message: 'Company is required' }),
    position: z.string({ message: 'Position is required' }),
    img: z.string({ message: 'Image is required' }),
    web: z.string({ message: 'Web is required' }),
    date: z.string({ message: 'Date is required' }),
    links: z.array(linkSchema),
    description: z.string({ message: 'Description is required' }),
    list: ListSchema,
    skills: z.array(skillsSchema),
  })
  .partial()

const projectSchema = z
  .object({
    name: z.string({ message: 'Project name is required' }),
    img: z.string({ message: 'Image is required' }),
    web: z.string({ message: 'Web is required' }),
    links: z.array(linkSchema),
    description: z.string({ message: 'Description is required' }),
    list: ListSchema,
    skills: z.array(skillsSchema),
  })
  .partial()

const educationSchema = z
  .object({
    name: z.string({ message: 'Institution name is required' }),
    degree: z.string({ message: 'Degree is required' }),
    img: z.string({ message: 'Image is required' }),
    date: z.string({ message: 'Date is required' }),
    links: z.array(linkSchema),
    list: ListSchema,
  })
  .partial()

const certificationSchema = z
  .object({
    name: z.string({ message: 'Certification name is required' }),
    url: z.string({ message: 'URL is required' }),
    list: ListSchema,
    skills: z.array(skillsSchema),
  })
  .partial()

export const devsyncObjectSchema = z
  .object({
    jobTitle: z.string({ message: 'Job title is required' }),
    description: z.string({ message: 'Description is required' }),
    status: z.object({
      status: z.string({ message: 'Status is required' }),
      badge: z.string({ message: 'Badge is required' }),
    }),
    languages: z.array(languageSchema),
    experience: z.array(experienceSchema),
    projects: z.array(projectSchema),
    education: z.array(educationSchema),
    certifications: z.array(certificationSchema),
  })
  .partial()

const devsyncSchema = z
  .object({
    defaultLang: z.string({ message: 'Default language is required' }),
    site: z.string({ message: 'Site is required' }),
    name: z.string({ message: 'Name is required' }),
    img: z.string({ message: 'Image is required' }),
    socialMedia: z.array(linkSchema),
    coreSkills: z.array(z.string({ message: 'Core skill is required' })),
    githubUserName: z.string({ message: 'GitHub username is required' }),
    address: z.string({ message: 'Address is required' }),
    email: z.string({ message: 'Email is required' }),
    phone: z.string({ message: 'Phone is required' }),
  })
  .catchall(z.unknown())

export type Link = z.infer<typeof linkSchema>
export type Skills = z.infer<typeof skillsSchema>
export type ListSchema = z.infer<typeof ListSchema>
export type Devsync = z.infer<typeof devsyncSchema>
export const devsyncSchemaPartial = devsyncSchema.partial()
export type DevsyncPartial = z.infer<typeof devsyncSchemaPartial>

export const parseDevsync = (devsync: unknown): DevsyncPartial =>
  devsyncSchemaPartial.safeParse(devsync).data ?? {}

export const getLangData = (devsync: DevsyncPartial, lang: string): DevsyncPartial =>
  devsyncObjectSchema.safeParse((devsync as Record<string, unknown>)[lang]).data ?? {}
