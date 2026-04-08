# Project documentation

Internal guides for this Shopware **6.7** template: local development with **DDEV**, tooling, and common workflows.

## DDEV

| Topic | Description |
|--------|-------------|
| [DDEV setup](ddev/ddev-setup.md) | Create a project, `Makefile` targets, Redis, Mailpit, database, watchers (6.7 Vite + legacy), image proxy, file server, DDEV updates, Mutagen, **known issues** |
| [DDEV deep dive](ddev/ddev-deep-dive.md) | How watchers, ports, and sales-channel URLs fit together; performance and Redis notes; links to official docs |
| [DDEV add-ons](ddev/ddev-add-ons.md) | Optional DDEV add-ons (Adminer, phpMyAdmin, MkDocs, Lighthouse, accessibility tools, Buggregator, …) |

## External references

- [DDEV documentation](https://ddev.readthedocs.io/en/stable/)
- [Shopware developer documentation](https://developer.shopware.com/)
- [Shopware user documentation](https://docs.shopware.com/en)

## Editing this site

- Markdown sources live under `docs/docs/` (see [DDEV add-ons — MkDocs](ddev/ddev-add-ons.md) if you use the MkDocs add-on).
- Navigation is defined in `docs/mkdocs.yml`.
