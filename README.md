# Devsync

![Devsync](apps/web/public/og.png)

![Glinter](https://glinter.jannael.com/badge.svg)
![Bun](https://img.shields.io/badge/Bun-fbf0df?logo=bun&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=fff)
![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=fff)
![Starlight](https://img.shields.io/badge/Starlight-FF5D01?logo=astro&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=fff)
![Oxlint](https://img.shields.io/badge/Oxlint-ec406c?logo=oxlint&logoColor=fff)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=000)
![Husky](https://img.shields.io/badge/Husky-000?logo=husky&logoColor=fff)
![Puppeteer](https://img.shields.io/badge/Puppeteer-4285F4?logo=puppeteer&logoColor=fff)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=fff)

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
