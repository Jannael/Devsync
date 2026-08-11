import type { Link, ListSchema } from '@devsync/core'

export class HtmlUtils {
	document({ lang, title, body }: { lang: string; title: string; body: string }) {
		return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${this.getStyles()}</style>
</head>
<body>
${body}</body>
</html>`
	}

	headline({ name, jobTitle }: { name?: string; jobTitle?: string }) {
		let headline = `<header>\n<h1>${name ?? ''}</h1>\n`
		if (jobTitle) {
			headline += `<p class="job-title">${jobTitle}</p>\n`
		}
		headline += `</header>\n`
		return headline
	}

	contactLine({ items }: { items: (string | undefined)[] }) {
		const contact = items.filter(Boolean).join(' | ')
		if (!contact) return ''
		return `<p class="contact">${contact}</p>\n`
	}

	section({ title, content }: { title: string; content: string }) {
		return `<section>\n<h2>${title}</h2>\n${content}</section>\n`
	}

	entryHeader({ title, subtitle, date }: { title: string; subtitle?: string; date?: string }) {
		let header = title
		if (subtitle) header += ` - ${subtitle}`
		if (date) header += ` <span class="date">(${date})</span>`
		return `<h3>${header}</h3>\n`
	}

	paragraph({ text }: { text: string }) {
		return `<p>${text}</p>\n`
	}

	getListItems({ items }: { items?: Partial<NonNullable<ListSchema['items']>[number]>[] }) {
		let listItems = ''
		for (const item of items ?? []) {
			listItems += `<li><strong>${item.highlight ?? ''}</strong> ${item.description ?? ''}</li>\n`
		}
		return listItems ? `<ul>\n${listItems}</ul>\n` : ''
	}

	getTextList({ items }: { items: (string | undefined)[] }) {
		let listItems = ''
		for (const item of items) {
			if (item) listItems += `<li>${item}</li>\n`
		}
		return listItems ? `<ul>\n${listItems}</ul>\n` : ''
	}

	getLinks({ links }: { links: Partial<Link>[] | undefined }) {
		let innerLinks = ''
		for (const link of links ?? []) {
			if (link?.url) {
				innerLinks += `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name ?? link.url}</a>\n`
			}
		}
		return innerLinks ? `<p class="links">\n${innerLinks}</p>\n` : ''
	}

	private getStyles() {
		return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717; line-height: 1.55; font-size: 13px; max-width: 780px; margin: 0 auto; }
a { color: inherit; }
header { margin-bottom: 12px; }
h1 { font-size: 26px; letter-spacing: 0.02em; }
.job-title { font-size: 15px; color: #525252; margin-top: 2px; }
.contact { font-size: 12px; color: #525252; margin-top: 6px; }
h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #333333; border-bottom: 1px solid #d4d4d4; padding-bottom: 4px; margin: 18px 0 8px; }
h3 { font-size: 13.5px; margin: 10px 0 2px; }
.date { color: #737373; font-weight: 400; }
p { margin: 2px 0 6px; }
ul { margin: 2px 0 8px; padding-left: 18px; }
.links a { margin-right: 10px; }
`
	}
}
