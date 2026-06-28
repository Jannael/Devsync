import type { Link, ListSchema, Skills } from '@devsync/core'

export class MdUtils {
	MD_SEPARATOR = '---'
	ACADEMICS_BADGE = '![Academics](https://img.shields.io/badge/Academics-9C27B0?style=flat&logo=education&logoColor=white)'

	badgeWithLink({ badge, link }: { badge: string; link: string }) {
		return `[${badge}](${link})`
	}

	getListItems({ items }: { items?: Partial<NonNullable<ListSchema['items']>[number]>[] }) {
		let listItems = ''
		for (const item of items ?? []) {
			listItems += `<li><strong>${item.highlight ?? ''}</strong> ${item.description ?? ''}</li>`
		}
		return listItems
	}

	getSkills({ skills }: { skills: Partial<Skills>[] | undefined }) {
		let innerSkills = ''
		for (const skill of skills ?? []) {
			innerSkills += skill.mdBadge ?? ''
		}
		return innerSkills
	}

	getLinks({ links }: { links: Partial<Link>[] | undefined }) {
		let innerLinks = ''
		for (const link of links ?? []) {
			innerLinks += this.badgeWithLink({
				badge: link?.mdBadge ?? '',
				link: link?.url ?? '',
			})
		}
		return innerLinks
	}

	getTdImg({ img, link, alt }: { img: string; link: string; alt: string }) {
		return `
<td width="40%">
  <a href="${link}" target="_blank" rel="noopener noreferrer">
    <picture>
      <img alt="${alt}" src="${img}" width="100%"/>
    </picture>
  </a>
</td>`
	}
}
