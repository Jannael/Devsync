import type { Link, ListSchema } from '@devsync/core'

export class TxtUtils {
	TXT_SEPARATOR = '-'.repeat(60)
	TXT_DOUBLE_SEPARATOR = '='.repeat(60)

	headline({ name, jobTitle }: { name?: string; jobTitle?: string }) {
		let headline = `${this.TXT_DOUBLE_SEPARATOR}\n`
		headline += `${(name ?? '').toUpperCase()}\n`
		if (jobTitle) {
			headline += `${jobTitle}\n`
		}
		headline += `${this.TXT_DOUBLE_SEPARATOR}\n`
		return headline
	}

	section({ title }: { title: string }) {
		return `\n${this.TXT_SEPARATOR}\n${title.toUpperCase()}\n${this.TXT_SEPARATOR}\n`
	}

	getListItems({ items }: { items?: Partial<NonNullable<ListSchema['items']>[number]>[] }) {
		let listItems = ''
		for (const item of items ?? []) {
			listItems += `  - ${item.highlight ?? ''}: ${item.description ?? ''}\n`
		}
		return listItems
	}

	getLinks({ links }: { links: Partial<Link>[] | undefined }) {
		let innerLinks = ''
		for (const link of links ?? []) {
			if (link?.url) {
				innerLinks += `  - ${link.name ?? 'Link'}: ${link.url}\n`
			}
		}
		return innerLinks
	}
}
