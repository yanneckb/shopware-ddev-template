# Shopware 6 with DDEV — setup

Step-by-step local DDEV setup for Shopware 6: project bootstrap, Makefile workflow, Redis, mail, database, watchers, image proxy, file server, updates, and troubleshooting.

!!! note "External references"
    - [DDEV documentation](https://ddev.readthedocs.io/en/stable/)
    - [Storefront and admin watchers with DDEV](https://notebook.vanwittlaer.de/ddev-for-shopware/storefront-and-admin-watchers-with-ddev)

For conceptual background and advanced topics, see [DDEV deep dive](ddev-deep-dive.md).

## Create a new DDEV project

Run the following in an **empty directory** (adjust versions as needed):

```bash
ddev config --project-type=shopware6 --docroot=public --php-version=8.3 --database=mysql:8.0
ddev composer create shopware/production
ddev exec console system:install --basic-setup --create-database --force --shop-locale=de_DE
```

Answer the prompt *“Do you want to include Docker configuration from recipes?”* with `x` (no).

---

## Basic DDEV setup

Create a `Makefile` and add the following (adjust placeholders at the top).

??? abstract "Makefile"
    ```makefile
    ### Manual ###
    # Before you can use this makefile you need to install ddev:
    # https://ddev.readthedocs.io/en/stable/#installation
    # Change the setup versions and add the plugins, theme and database you want to use
    #
    # To create a new project execute `make ddev-create-project`
    # If you want to use an existing project use `make ddev-setup-existing-project`
    #
    # First run `make ddev-setup`. After that you can start the project with `make ddev-start`
    # (You may have to add the ddev domain with http to your sales channel)
    #
    # To update the project run `make ddev-update-project`
    #
    # To stop the project just run `make ddev-stop`
    ##############

    ### Setup versions ###
    phpVersion=8.4
    dbConfig=mysql:8.0
    nodejs=22

    ### Project config ###
    plugins=[plugins]
    theme=[theme]
    database=[database.sql.gz]

    ### DDEV commands ###
    ddev-cache:
    	ddev exec shopware-cli project clear-cache

    ddev-composer:
    	ddev exec composer install

    ddev-basic-setup:
    	ddev exec console system:install --basic-setup --create-database --force --shop-locale=de_DE

    ddev-plugins:
    	ddev exec console plugin:install ${plugins} -a -n -c

    ddev-theme:
    	ddev exec console plugin:install ${theme} -a -n -c
    	make ddev-build
    	ddev exec console theme:change --all ${theme}

    ddev-build:
    	ddev exec shopware-cli project admin-build --force-install-dependencies
    	ddev exec shopware-cli project storefront-build --force-install-dependencies

    ddev-storefront:
    	ddev exec shopware-cli project storefront-watch --only-custom-static-extensions

    ddev-admin:
    	ddev exec shopware-cli project admin-watch --only-custom-static-extensions

    ddev-start:
    	ddev start
    	make ddev-storefront

    ddev-stop:
    	ddev stop --stop-servers

    ddev-image-proxy:
    	ddev exec shopware-cli project image-proxy --url http://my-shop.ddev.site --external-url https://www.my-shop.com/

    ### DDEV setup commands ###
    ddev-update-project:
    	ddev exec rm -rf composer.lock
    	ddev exec composer update
    	make ddev-plugins
    	make ddev-theme
    	make ddev-build
    	make ddev-cache
    	@echo 'Project update finished!'

    ddev-config:
    	ddev config --project-type=shopware6 --docroot=public --create-docroot --php-version=${phpVersion} --database=${dbConfig} --nodejs-version=${nodejs} --webserver-type=nginx-fpm --performance-mode=none

    # Create new DDEV project
    ddev-create-project:
    	make ddev-config
    	ddev composer create shopware/production
    	make ddev-init

    # Integrate DDEV into existing project
    ddev-setup-existing-project:
    	make ddev-config
    	make ddev-init

    # Initialize project with new ENV file and shopware-cli
    ddev-init:
    	echo "APP_SECRET=$$(openssl rand -hex 16)" > .env.ddev
    	make ddev-setup -k

    # Setup configured DDEV project
    ddev-setup:
    	echo "COPY --from=shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli" > .ddev/web-build/Dockerfile.shopware-cli
    	cp .env.ddev .env.local
    	ddev start
    	make ddev-composer
    	-@make ddev-basic-setup
    	-@make ddev-plugins
    	-@make ddev-theme
    	make ddev-build
    	make ddev-cache
    	ddev launch /admin
    	@echo 'ddev setup finished! You may want to run make ddev-import-db next!'

    # Export database
    ddev-export-db:
    	ddev export-db --file=.devOps/db/${database}

    # Import database
    ddev-import-db:
    	ddev import-db --file=.devOps/db/${database}
    	ddev exec bin/console database:migrate --all
    	ddev exec bin/console database:migrate-destructive --all
    	ddev exec bin/console cache:clear
    	ddev exec bin/console dal:refresh:index
    	ddev exec bin/build-js.sh
    ```

Adjust: **PHP/MySQL/Node versions**, **plugins**, **theme name**, and **database file name** as needed.

---

## Redis

**Redis 6** — [ddev-redis](https://github.com/ddev/ddev-redis)

```bash
ddev add-on get ddev/ddev-redis
ddev restart
```

**Redis 7** — [ddev-redis-7](https://github.com/ddev/ddev-redis-7)

```bash
ddev add-on get ddev/ddev-redis-7
ddev restart
```

More add-ons (Adminer, phpMyAdmin, …) are listed under [DDEV add-ons](ddev-add-ons.md).

---

## Shopware CLI

Official docs: [Shopware CLI — DDEV](https://developer.shopware.com/docs/products/cli/installation.html#ddev)

Create `.ddev/web-build/Dockerfile.shopware-cli`:

```dockerfile
# .ddev/web-build/Dockerfile.shopware-cli
COPY --from=shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli
```

---

## Mailer with Mailpit

1. Set in your env file: `MAILER_DSN=smtp://localhost:1025`
2. In the Admin: **Settings → Mailer → Use environment configuration**
3. Run: `bin/console system:config:set core.basicInformation.email doNotReply@localhost.com`

---

## Database configuration

See [DDEV: local database management](https://ddev.com/blog/ddev-local-database-management/).

- From the host: `ddev mysql`
- Inside the DB container: `ddev ssh -s db`

### Import and export

```bash
# Import
ddev import-db --file=path/to/database.sql.gz

# Export
ddev export-db --file=path/to/database.sql.gz

# Snapshot (stored under .ddev/db_snapshots)
ddev snapshot --name=two-dbs
ddev restore-snapshot two-dbs
```

### GUI clients

If you use [Sequel Ace](https://sequel-ace.com/), [TablePlus](https://tableplus.com/), or similar:

```bash
ddev sequelace
ddev tableplus
# Sequel Pro (legacy): ddev sequelpro
```

Optional: bind a **unique** host port per project in `.ddev/config.yaml`:

```yaml
### .ddev/config.yaml ###
host_db_port: "59002"
```

---

## DDEV configuration and watchers

### Default `.ddev/config.yaml`

??? abstract ".ddev/config.yaml (example)"
    ```yaml
    ### DDEV storefront and admin watcher configuration ###
    name: [project-name]
    type: shopware6
    docroot: public
    php_version: "8.4"
    webserver_type: nginx-fpm
    xdebug_enabled: false
    additional_hostnames: []
    additional_fqdns: []
    database:
        type: mysql
        version: "8.0"
    performance_mode: none
    use_dns_when_possible: true
    composer_version: "2"
    web_environment: []
    corepack_enable: false
    # Optional: unique per project
    # host_db_port: "59002"
    ```

### Watcher (storefront and administration)

Add a watcher overlay, e.g. `.ddev/config.watcher.yaml` (merge with your main config as your DDEV version supports).

!!! warning "Shopware 6.7 and Vite"
    From Shopware **6.7**, the stack uses **Vite**. The watcher snippet below must be used so the **admin** watcher works (port range matters for Shopware’s port discovery).

??? abstract "Shopware 6.7 — .ddev/config.watcher.yaml (Vite)"
    ```yaml
    ### DDEV storefront and admin watcher configuration ###
    # ADMIN_PORT must be in range 5173..6333 (Shopware findAvailablePorts), not 9997
    web_environment:
        - HOST=0.0.0.0
        - ADMIN_PORT=5173
        - PROXY_URL=${DDEV_PRIMARY_URL}:9998
        - STOREFRONT_SKIP_SSL_CERT=true
        - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    web_extra_exposed_ports:
        - name: admin-proxy
          container_port: 5173
          http_port: 8887
          https_port: 5173
        - name: storefront-proxy
          container_port: 9998
          http_port: 8888
          https_port: 9998
        - name: storefront-assets
          container_port: 9999
          http_port: 8889
          https_port: 9999
    ```

??? abstract "Shopware before 6.7 — .ddev/config.watcher.yaml (legacy)"
    ```yaml
    ### DDEV storefront and admin watcher configuration ###
    web_environment:
        - HOST=0.0.0.0
        - PORT=9997
        - DISABLE_ADMIN_COMPILATION_TYPECHECK=1
        - PROXY_URL=${DDEV_PRIMARY_URL}:9998
        - STOREFRONT_SKIP_SSL_CERT=true
        - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    web_extra_exposed_ports:
        - name: admin-proxy
          container_port: 9997
          http_port: 8887
          https_port: 9997
        - name: storefront-proxy
          container_port: 9998
          http_port: 8888
          https_port: 9998
        - name: storefront-assets
          container_port: 9999
          http_port: 8889
          https_port: 9999
    ```

- **Storefront watcher:** port **9998** (HTTPS)
- **Admin watcher:** port **8889** (HTTPS) in this example

In the **sales channel**, register the shop URL as normal **HTTP** and **without a port**, e.g. `http://<your-project>.ddev.site/`. Without watchers, HTTPS works as usual if configured in the sales channel.

!!! info "Older Shopware versions"
    You may need to allow mixed content in the browser for watcher HTTP/HTTPS mixing. See [Known issues](#known-issues).

---

## Image proxy

Docs: [Shopware CLI — image-proxy](https://developer.shopware.com/docs/products/cli/project-commands/image-proxy.html)

The Shopware CLI can proxy missing media from another environment (e.g. production).

```makefile
ddev-image-proxy:
	ddev exec shopware-cli project image-proxy --url http://my-shop.ddev.site --external-url https://www.my-shop.com/
```

Run the proxy alongside the watcher when needed. Shopware CLI creates `config/packages/zzz-sw-cli-image-proxy.yml` for the temporary file server.

For a **persistent** remote filesystem setup, see [File server](#file-server) below.

---

## File server

Docs: [Shopware filesystem / hosting](https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem.html)

To load media from staging or production locally, set `web_environment` in `.ddev/config.yaml`, for example:

```yaml
web_environment:
  - APP_ENV=local
  - APP_DEBUG=1
  - SHOPWARE_HTTP_CACHE_ENABLED=0
  - SHOPWARE_FILESYSTEM_URL=https://www.example-shop.com/
```

Add `config/packages/local/shopware.yaml`:

```yaml
shopware:
  auto_update:
    enabled: false
  admin_worker:
    enable_admin_worker: false
  filesystem:
    public:
      type: "local"
      url: "%env(SHOPWARE_FILESYSTEM_URL)%"
      config:
        root: "%kernel.project_dir%/public"
```

!!! info "APP_ENV=local"
    With `APP_ENV=local` the stack behaves closer to production defaults; keep `APP_DEBUG=1` if you need Symfony/debug tooling locally.

---

## Update DDEV

Workflow FAQ: [DDEV documentation](https://ddev.readthedocs.io/en/stable/users/usage/faq/#workflow)

**macOS (Homebrew):**

```bash
brew upgrade ddev
brew delete images --all
ddev --version
```

**Install script:**

```bash
curl -fsSL https://raw.githubusercontent.com/ddev/ddev/master/scripts/install_ddev.sh | bash
ddev --version
```

In each project, run once:

```bash
ddev config --update
```

---

## Performance: disable Mutagen

See [DDEV: Mutagen and performance](https://ddev.readthedocs.io/en/stable/users/install/performance/#mutagen).

```bash
ddev mutagen reset && ddev config global --performance-mode=none && ddev config --performance-mode=none
```

To re-enable Mutagen for a project:

```bash
ddev config --performance-mode=mutagen
```

---

## Known issues

| Problem | Solution |
|--------|----------|
| Mixed content with HTTPS/HTTP while using watchers | In Chrome open `chrome://settings/content/insecureContent` and allow `[*.]ddev.site`. |
| 502 Bad Gateway; watcher runs but CSS/JS missing | Check `config.watcher.yaml`; try `PROXY_URL=http://${DDEV_HOSTNAME}:9998`. |
| Permission denied running `bin/...` | `ddev exec sudo chmod +x bin/*` |
| Redis missing | `ddev add-on get ddev/ddev-redis` (or Redis 7 add-on). |
| “Unable to find a matching sales channel for the request: `http://<project>.ddev.site/`” | In Admin, add the domain to the sales channel; add **HTTP** in addition to HTTPS if needed. |
| “No route found for GET …” after starting watcher | Use standard `http://<project>.ddev.site/` in the sales channel **without** a port. |
| DB or Node.js errors during `make ddev-init` | Adjust Node version in DDEV / `ddev-config` to match your project. |
| Webpack dev server errors | Try different watcher URLs or ports in watcher config or `.env` / `.env.local`, or follow [van Wittlaer — DDEV watchers](https://notebook.vanwittlaer.de/ddev-for-shopware/storefront-and-admin-watchers-with-ddev). |
| `ddev --version` shows an old version | Run `which -a ddev`; use [installing a specific DDEV version](https://ddev.readthedocs.io/en/stable/users/usage/faq/#how-can-i-install-a-specific-version-of-ddev), `ddev self-upgrade`, or the install script. See also [ddev#6616](https://github.com/ddev/ddev/issues/6616). |
| `Unable to open browser! … spawn xdg-open ENOENT` | Harmless: CLI cannot open a browser from the container. Optional: `ddev ssh`, install `xdg-utils`, `ddev restart`. |
| Watcher issues / mkcert warnings | Install [mkcert](https://github.com/FiloSottile/mkcert) and see [DDEV trusted HTTPS](https://ddev.com/blog/ddev-local-trusted-https-certificates/). |
| `http-proxy-middleware` missing after watcher start | In `vendor/shopware/storefront/Resources/app/storefront` run `npm install`, then restart the watcher. |
| Chromium errors on arm64 | See e.g. [pt1602 — M1, DDEV, Chromium, npm](https://blog.pt1602.de/docker/m1-ddev-chromium-npm/). |
| Styles missing in watcher | Temporarily disable problematic plugins (cookie consent, GTM, etc.) locally. |
| APT/GPG errors for `packages.sury.org` during image build | Upgrade DDEV (e.g. v1.25.0+). Try `ddev poweroff` and `ddev utility download-images`. [ddev#8106](https://github.com/ddev/ddev/issues/8106). |
| Redis: `maxmemory-policy` / `RedisTagAwareAdapter` | In `.ddev/redis/memory.conf`, set `maxmemory-policy noeviction` (not `allkeys-lru`) for Symfony’s tag-aware adapter. |

Example Redis fix:

```text
# noeviction required for Symfony RedisTagAwareAdapter (allkeys-lru not supported)
maxmemory-policy noeviction
```
