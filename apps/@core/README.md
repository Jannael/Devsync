# Devsync Template

A professional template for generating developer profiles, and portfolios using [Devsync](https://devsync.work).

need help? [docs](https://devsync.work/getting-started)

## Usage

Initialize a new project with this template:

```bash
bunx @jannael/devsync init --template @owner/repo-name
```

Replace `@owner/repo-name` with the GitHub repository where this template is published.

## Template Structure

```
.
├── DEVSYNC.json          # Main configuration file with your profile data
├── package.json          # Project dependencies
├── src/
│   └── devsync/         # Custom Devsync components and logic
├── public/              # Static assets (images, icons)
│   ├── poster-light-mode.webp
│   └── poster-dark-mode.webp
├── .github/
│   └── workflows/       # GitHub Actions for automation
└── .agents/
    └── skills/          # AI agent skills and configurations
```

## Publishing Your Template

Share your customized template with the community make a pull request to add it to the [Devsync](https://github.com/jannael/devsync) repository see [Docs](https://devsync.work/docs/create-template#publish) for more information.

## Support the Project

If you find Devsync useful, give it a star on GitHub:

⭐ [github.com/jannael/devsync](https://github.com/jannael/devsync)

---

Built with [Devsync](https://devsync.work) — Focus on what you do best.
