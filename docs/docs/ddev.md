# Shopware Setup with DDEV

> [DDEV Documentation](https://ddev.readthedocs.io/en/stable/)
> 
> [DDEV Watcher Documentation](https://notebook.vanwittlaer.de/ddev-for-shopware/storefront-and-admin-watchers-with-ddev)

## Create new ddev project

To create a new project, the following commands must be executed in an **empty folder** (adjust versions accordingly):

```bash
ddev config --project-type=shopware6 --docroot=public --php-version=8.3 --database=mysql:8.0
ddev composer create shopware/production
ddev exec console system:install --basic-setup --create-database --force --shop-locale=de_DE
```

Answer the question "Do you want to include Docker configuration from recipes?" with `x`.

---

## Basic ddev Setup

Create a `Makefile` and add the following:

<details><summary>Makefile</summary>
<pre>

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
# (You may have to add the ddev domain with http to your saleschannel)
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
    ddev exec shopware-cli project admin-build
    ddev exec shopware-cli project storefront-build

ddev-storefront:
    shopware-cli project storefront-watch --only-custom-static-extensions

ddev-admin:
    shopware-cli project admin-watch --only-custom-static-extensions

ddev-start:
    ddev start
    make ddev-storefront

ddev-stop:
    ddev stop --stop-servers

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

# Integrate DDEV to existing project
ddev-setup-existing-project:
    make ddev-config
    make ddev-init

# Initialize project with new ENV-file and shopware-cli
ddev-init:
    echo "APP_SECRET=$$(openssl rand -hex 16)" > .env.ddev
    echo "COPY --from=shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli" > .ddev/web-build/Dockerfile.shopware-cli
    make ddev-setup -k

# Setup configured DDEV project
ddev-setup:
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

</pre>
</details>

Only the following things need to be adjusted: `versions`, `plugins`, `theme name` and optionally `database name`

---

## Install Redis

[Redis 6](https://github.com/ddev/ddev-redis)

```bash
ddev get ddev/ddev-redis
ddev restart
```

[Redis 7](https://github.com/ddev/ddev-redis-7)

```bash
ddev get ddev/ddev-redis-7
ddev restart
```

---

## Install Shopware CLI

[Shopware-CLI Installation](https://developer.shopware.com/docs/products/cli/installation.html#ddev)

Create a new file `./.ddev/web-build/Dockerfile.shopware-cli` and insert the following:

```dockerfile
# .ddev/web-build/Dockerfile.shopware-cli
COPY --from=shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli
```

---

## Mailer with Mailpit

1. Edit env file: `MAILER_DSN=smtp://localhost:1025`
2. Settings → Mailer → Use environment configuration
3. `bin/console system:config:set core.basicInformation.email doNotReply@localhost.com`

---

## Database Configuration

[DDEV Database Management](https://ddev.com/blog/ddev-local-database-management/)

With the command `ddev mysql` you can directly access the MySQL database via the console. Within the container this is possible with `ddev ssh -s db`.

### Import / Export DBs

```bash
# Import database with ddev
ddev import-db --file=path/to/[database.sql.gz]

# Export database
ddev export-db --file=path/to/[database.sql.gz]

# Create database snapshot (target path is .ddev/db_snapshots)
ddev snapshot --name=two-dbs
ddev restore-snapshot two-dbs
```

If DB explorers like [Sequel Pro](https://github.com/sequelpro/sequelpro), [Sequel Ace](https://sequel-ace.com/) or [TablePlus](https://tableplus.com/) are installed, they can be opened with the corresponding DDEV commands:

```bash
# Sequel Pro
ddev sequelpro

# Sequel Ace
ddev sequelace

# TablePlus
ddev tableplus
```

In the `.ddev/config.yaml` a project-specific port for the database can be created. This is optional, but should be different for each project!

```yaml
### .ddev/config.yaml ###
# Binding the db port
host_db_port: "59002"
```

---

## DDEV Configuration & Watcher

Create a `config.watcher.yaml` in the `.ddev` folder:

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
# Binding the db port is optional, but has to be different for every project!
# host_db_port: "59002"
```

The **Storefront-Watcher** is accessible on port **:9998** and the **Admin-Watcher** on **:8889** (both HTTPS).

In the sales channel, the URL (`http://<project-webshop>.ddev.site/`) should be entered as normal **HTTP** and **without port**! Without watcher, the page can of course be reached via **HTTPS**, as long as this is also maintained in the **sales channel**.

> For older Shopware versions, mixed-content may need to be allowed in the browser (see Known Issues)

---

## File Server

To load media from stage or prod environments locally, a file server can be set up. For this, the following `web_environments` must be set in the `.ddev/config.yaml`:

```yaml
web_environment:
  - APP_ENV=local
  - APP_DEBUG=1
  - SHOPWARE_HTTP_CACHE_ENABLED=0
  - SHOPWARE_FILESYSTEM_URL=https://www.web-shop.com/
```

In addition, the following configuration must be added under `./config/packages/local/shopware.yaml`:

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

> Since APP_ENV is set to local, the system theoretically runs in prod mode. Therefore, APP_DEBUG must be activated to continue debugging.

---

## Update ddev

→ [DDEV Docs](https://ddev.readthedocs.io/en/stable/users/usage/faq/#workflow)

To update ddev, the following commands must be executed:

```bash
brew upgrade ddev
brew delete images --all
ddev --version
```

Otherwise use this command:

```bash
curl -fsSL https://raw.githubusercontent.com/ddev/ddev/master/scripts/install_ddev.sh | bash
ddev --version
```

Run `ddev config --update` once in the respective project.

---

## Improve performance: Disable Mutagen

[Performance - DDEV Docs](https://ddev.readthedocs.io/en/stable/users/install/performance/#mutagen)

Execute `ddev mutagen reset && ddev config global --performance-mode=none && ddev config --performance-mode=none`. Mutagen will then be globally disabled. To activate it for other projects, run `ddev config --performance-mode=mutagen`.

---

## Known Issues

| Problem | Solution |
|---------|--------|
| "Mixed Content" with HTTPS and HTTP when using Watcher | In Chrome: open `chrome://settings/content/insecureContent` and allow `[*.]ddev.site` there |
| Missing permissions when executing a `bin/...` command | ```bash<br>ddev exec sudo chmod +x bin/*<br>``` |
| Redis is missing | ```bash<br>ddev get ddev/ddev-redis<br>``` |
| "Unable to find a matching sales channel for the request: http://project-webshop.ddev.site/". Please make sure the domain mapping is correct. | In the Shopware Admin area, the URL must be added to the sales channel or in addition to `https` an `http` address must be created |
| No Route found for "GET …" as soon as the Watcher is started | The standard address (`http://project-webshop.ddev.site/`) must be entered as `http` in the respective sales channel and **no port** may be entered |
| DB or node.js error | The nodejs version must be changed when running `make ddev-init` |
| Any webpack-dev-server error | There is no proper fix for this yet. Try a different configuration in `.ddev/watcher.config.yaml` (change URL there or in `.env/.env.local`, change ports like `9998` and `9999`).<br><br>Or try this guide: [Storefront and Admin Watchers with ddev](https://notebook.vanwittlaer.de/ddev-for-shopware/storefront-and-admin-watchers-with-ddev) |
| `ddev --version` shows an old version | Find out which ddev versions are installed with ```bash<br>which -a ddev<br>``` ([Docs](https://ddev.readthedocs.io/en/stable/users/usage/faq/#how-can-i-install-a-specific-version-of-ddev)).<br><br>Execute ```bash<br>ddev self-upgrade<br>``` to update ddev correctly (if necessary, ```bash<br>curl -fsSL https://raw.githubusercontent.com/ddev/ddev/master/scripts/install_ddev.sh \| bash<br>``` must be executed).<br><br>[Issue #6616](https://github.com/ddev/ddev/issues/6616) |
| Unable to open browser! | <details><summary>Show error message</summary><br><pre><code>Error: spawn xdg-open ENOENT<br>    at ChildProcess._handle.onexit (node:internal/child_process:284:19)<br>    at onErrorNT (node:internal/child_process:477:16)<br>    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {<br>  errno: -2,<br>  code: 'ENOENT',<br>  syscall: 'spawn xdg-open',<br>  path: 'xdg-open',<br>  spawnargs: [ 'https://example.ddev.site:9998/' ]<br>}<br></code></pre></details><br>**Solution:**<br>```bash<br>ddev ssh<br>sudo apt-get update<br>sudo apt-get install xdg-utils<br>```<br>then run ```bash<br>ddev restart<br>``` |
| If the Watcher doesn't work properly (and possibly an mkcert warning appears) | Install `mkcert`:<br>- [mkcert Repo](https://github.com/FiloSottile/mkcert)<br>- [ddev HTTPS Certificates](https://ddev.com/blog/ddev-local-trusted-https-certificates/) |
| As soon as you start the Watcher, you get `http-proxy-middleware` missing | ```bash<br>cd vendor/shopware/storefront/Resources/app/storefront<br>npm install<br>``` then restart the Watcher |
| Chromium error (on arm64 chips) | [Blogpost: Docker M1 + ddev + Chromium + npm](https://blog.pt1602.de/docker/m1-ddev-chromium-npm/) |
