# DDEV deep dive (Shopware)

This page explains **why** the [DDEV setup](ddev-setup.md) steps look the way they do. For copy-paste commands and the full checklist, use [DDEV setup](ddev-setup.md).

## DDEV + Shopware: what runs where

- **Web container:** PHP, Nginx, Node (when used by Shopware CLI), and **shopware-cli** if you add the Dockerfile snippet from [DDEV setup — Shopware CLI](ddev-setup.md#shopware-cli).
- **DB container:** MySQL/MariaDB; `ddev mysql` and GUI helpers (`ddev sequelace`, …) connect from the host.
- **Host:** Traefik (or router) exposes `*.ddev.site`; extra ports for watchers are mapped via `web_extra_exposed_ports` in watcher overlays.

Official overview: [DDEV architecture](https://ddev.readthedocs.io/en/stable/users/architecture/).

## Watchers: ports and HTTPS

Shopware’s storefront and admin dev servers bind **inside** the web container. DDEV publishes them on the host through named `web_extra_exposed_ports` entries.

- **Storefront** dev traffic is commonly proxied on **9998** (HTTPS) in the templates in [DDEV setup — watchers](ddev-setup.md#ddev-configuration-and-watchers).
- **Admin:** Shopware **6.7** uses **Vite**; `ADMIN_PORT` must fall in the range Shopware’s tooling expects (see the Vite snippet in setup). Older versions used a single `PORT` (e.g. 9997).

`PROXY_URL` tells the storefront tooling which origin the browser should use for the proxied asset server. If assets 502 or fail to load, try `PROXY_URL=http://${DDEV_HOSTNAME}:9998` as in [Known issues](ddev-setup.md#known-issues).

## Sales channel URL: HTTP, no port

With watchers, the storefront often serves **HTTPS** on high ports while the **canonical** shop URL in Shopware should remain **`http://<project>.ddev.site/`** (no port). That avoids mismatches between sales channel domain resolution and what the webpack/Vite proxy expects. Symptom table: [Known issues](ddev-setup.md#known-issues).

## Image proxy vs file server

- **Image proxy** (Shopware CLI): quick way to pull missing thumbnails/media from a remote URL into local requests; generates temporary config under `config/packages/`. See [DDEV setup — Image proxy](ddev-setup.md#image-proxy).
- **File server** (`SHOPWARE_FILESYSTEM_URL`): points the public filesystem at remote media for longer sessions. See [DDEV setup — File server](ddev-setup.md#file-server) and [Shopware filesystem guide](https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem.html).

## Database: host port binding

`host_db_port` in `.ddev/config.yaml` lets GUI clients connect to MySQL on the host. Use a **different** port per project to avoid clashes. Details: [DDEV setup — Database configuration](ddev-setup.md#database-configuration).

## Performance: Mutagen

On macOS, DDEV may use Mutagen for file sync. If I/O feels slow or sync acts up, resetting Mutagen and switching `performance_mode` can help — see [DDEV setup — Performance: disable Mutagen](ddev-setup.md#performance-disable-mutagen) and [DDEV: Mutagen](https://ddev.readthedocs.io/en/stable/users/install/performance/#mutagen).

## Redis and Symfony cache

Symfony’s `RedisTagAwareAdapter` does **not** support `allkeys-lru` as `maxmemory-policy`. Use **`noeviction`** (or a compatible volatile policy) in `.ddev/redis/memory.conf`. Symptom and snippet: [Known issues](ddev-setup.md#known-issues).

## Further reading

- [Storefront and admin watchers with DDEV](https://notebook.vanwittlaer.de/ddev-for-shopware/storefront-and-admin-watchers-with-ddev)
- [Shopware CLI](https://developer.shopware.com/docs/products/cli/installation.html)
- [DDEV add-ons catalog](https://addons.ddev.com/) — curated entries in [DDEV add-ons](ddev-add-ons.md)
