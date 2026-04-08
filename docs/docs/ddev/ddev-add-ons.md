# DDEV add-ons

Install DDEV add-ons with `ddev add-on get <name>`, then run `ddev restart` so configuration and containers pick up changes.

```bash
# Install an add-on
ddev add-on get <ADDON_NAME>

# List installed add-ons
ddev add-on list --installed

# Remove an add-on
ddev add-on remove <ADDON_NAME>
```

Statuses below are **team-tested** hints, not guarantees for every host OS or DDEV version. Verify with `ddev describe` and the upstream add-on README.

---

## ddev-adminer — works

**Addon:** [ddev/ddev-adminer](https://addons.ddev.com/addons/ddev/ddev-adminer)

Lightweight web UI to browse and manage the database.

### Install

```bash
ddev add-on get ddev/ddev-adminer
ddev restart
```

### Use

Run `ddev adminer` and open the URL/port shown (often **9101**; confirm with `ddev describe`).

---

## ddev-phpmyadmin — works

**Addon:** [ddev/ddev-phpmyadmin](https://addons.ddev.com/addons/ddev/ddev-phpmyadmin)

phpMyAdmin for MySQL/MariaDB.

### Install

```bash
ddev add-on get ddev/ddev-phpmyadmin
ddev restart
```

### Use

Run `ddev phpmyadmin` and open the URL/port shown (often **8037**; confirm with `ddev describe`).

---

## ddev-lighthouse — works

**Addon:** [Metadrop/ddev-lighthouse](https://addons.ddev.com/addons/Metadrop/ddev-lighthouse)

Runs [Google Lighthouse](https://developer.chrome.com/docs/lighthouse) against your site from the container.

### Install

```bash
ddev add-on get Metadrop/ddev-lighthouse
ddev restart
```

### Use

1. In `./tests/lighthouse/local/lighthouserc.js`, set the **HTTP** URL of your shop (example: `'http://your-project.ddev.site'`).
2. Run `ddev lighthouse`.
3. Open the HTML report under `./reports/lighthouse/local/` (exact filename may vary).

---

## ddev-mkdocs — works

**Addon:** [Metadrop/ddev-mkdocs](https://addons.ddev.com/addons/Metadrop/ddev-mkdocs)

Serves this documentation as a static site (MkDocs) from the project.

### Install

```bash
ddev add-on get Metadrop/ddev-mkdocs
ddev restart
```

### Use

Open the service URL/port from `ddev describe` (often **9005**). Place Markdown under `docs/docs/` and register pages in `docs/mkdocs.yml`.

---

## ddev-pa11y — tested

**Addon:** [Metadrop/ddev-pa11y](https://addons.ddev.com/addons/Metadrop/ddev-pa11y)

Runs [pa11y](https://pa11y.org/) accessibility checks from DDEV.

### Install

```bash
ddev add-on get Metadrop/ddev-pa11y
ddev restart
```

### Use

```bash
ddev pa11y <SHOP_DOMAIN> --reporter=junit --standard=WCAG2A
```

Reports are written under `./report` (see add-on docs for paths). Configure pa11y in `tests/pa11y/config.json` if needed.

---

## ddev-a11ywatch — tested

**Addon:** [a11ywatch/ddev-a11ywatch](https://addons.ddev.com/addons/a11ywatch/ddev-a11ywatch)

Integrates [A11yWatch](https://a11ywatch.com/) for accessibility scanning in DDEV (separate from pa11y).

### Install

```bash
ddev add-on get a11ywatch/ddev-a11ywatch
ddev restart
```

### Use

Follow the add-on README for the correct `ddev` subcommand and UI port; use `ddev describe` to list exposed URLs.

---

## ddev-browsersync — not tested

**Addon:** [ddev/ddev-browsersync](https://addons.ddev.com/addons/ddev/ddev-browsersync)

Adds [Browsersync](https://browsersync.io/) for live-reload across browsers/devices.

### Install

```bash
ddev add-on get ddev/ddev-browsersync
ddev restart
```

### Use

See the [add-on overview](https://addons.ddev.com/addons/ddev/ddev-browsersync#overview) for proxy URL, ports, and Shopware-specific notes.

---

## ddev-buggregator — tested

**Addon:** [iljapolanskis/ddev-buggregator](https://addons.ddev.com/addons/iljapolanskis/ddev-buggregator)

[Buggregator](https://docs.buggregator.dev/) for debugging and aggregating dumps/logs.

### Install

```bash
ddev add-on get iljapolanskis/ddev-buggregator
ddev restart
```

### Use

Open the URL/port from `ddev describe` (often **8000**).

---

## See also

- [DDEV setup](ddev-setup.md) — Redis, database tools, and core Shopware + DDEV configuration
- [Official add-on directory](https://addons.ddev.com/)
