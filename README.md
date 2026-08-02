# Devsync

![Devsync](apps/web/public/og.png)

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

