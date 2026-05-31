# Devsync

![Devsync](apps/web/public/og.png)

![Glinter](https://glinter.jannael.com/badge.svg)
![Bun](https://img.shields.io/badge/Bun-000000.svg?style=flat&logo=Bun&logoColor=ffffff)
![Typescript](https://img.shields.io/badge/Typescript-3b82f6.svg?style=flat&logo=Typescript&logoColor=ffffff)
![Astro](https://img.shields.io/badge/Astro-ef4444.svg?style=flat&logo=Astro&logoColor=ffffff)
![Starlight](https://img.shields.io/badge/Starlight-ef4444.svg?style=flat&logo=astro&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-f8fafc.svg?style=flat&logo=Tailwind%20CSS&logoColor=000000)
![Vite](https://img.shields.io/badge/Vite-7c3aed.svg?style=flat&logo=Vite&logoColor=ffffff)
![Vitest](https://img.shields.io/badge/Vitest-000000.svg?style=flat&logo=Vitest&logoColor=ffffff)
![Oxlint](https://img.shields.io/badge/Oxlint-000000.svg?style=flat&logo=Oxlint&logoColor=ffffff)
![Prettier](https://img.shields.io/badge/Prettier-f59e0b.svg?style=flat-square&logo=Prettier&logoColor=ffffff)
![Husky](https://img.shields.io/badge/Husky-000000.svg?style=flat&logo=Husky&logoColor=ffffff)
![Puppeteer](https://img.shields.io/badge/Puppeteer-f8fafc.svg?style=flat-square&logo=Puppeteer&logoColor=000000)
![Zod](https://img.shields.io/badge/Zod-3b82f6.svg?style=flat&logo=Zod&logoColor=ffffff)
![Cloudflare](https://img.shields.io/badge/Cloudflare-f59e0b.svg?style=flat&logo=Cloudflare&logoColor=ffffff)
![Config](https://img.shields.io/badge/Config-000000.svg?style=flat&logo=Config&logoColor=ffffff)

One file to keep your portfolio, CV, GitHub and LinkedIn in sync.

> **Full documentation, features, and live demo** at [devsync.work](https://devsync.work)

## What is Devsync?

A CLI tool that generates your professional resume, portfolio site, GitHub profile, LinkedIn summary, and academic history — all from a single `DEVSYNC.json` configuration file.

## Quick Start

```bash
bunx @jannael/devsync init
```

## Security

Security is a top priority for this project.

This project uses Bun as its runtime and package manager. You don't need to worry about package vulnerabilities — the `bunfig.toml` configuration includes `minimumReleaseAge = 259200` (3 days), which prevents newly published packages from being installed automatically. This protects against supply chain attacks that have become increasingly common in the npm ecosystem.

## License

[CC-BY-NC-4.0](LICENSE)
