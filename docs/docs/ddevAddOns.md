# DDEV Add-Ons

Add-ons can be installed in ddev with the command `ddev add-on get xxx`. After that, a `ddev restart` must be executed for the add-on to take effect.

``` 
# add an add-on
ddev add-on get <ADDON_NAME>

# list installed add-ons
ddev add-on list --installed

# remove installed add-on
ddev add-on remove <ADDON_NAME>
```

---

## ddev-adminer (works)

[https://addons.ddev.com/addons/ddev/ddev-adminer](https://addons.ddev.com/addons/ddev/ddev-adminer)

Adds an Adminer to manage the database

### Installation

``` 
ddev add-on get ddev/ddev-adminer
ddev restart
```

Then start Adminer with `ddev adminer` and open it via port `9101` (check via `ddev describe` if necessary)

---

ddev-phpmyadmin (works)

[https://addons.ddev.com/addons/ddev/ddev-phpmyadmin](https://addons.ddev.com/addons/ddev/ddev-phpmyadmin)

Adds phpMyAdmin, an administration tool for MySQL and MariaDB.

### Installation

``` 
ddev add-on get ddev/ddev-phpmyadmin
ddev restart​
```

Then start phpMyAdmin with `ddev phpmyadmin` and open it via port `8037` (check via `ddev describe` if necessary)

---

## ddev-lighthouse (works)

[https://addons.ddev.com/addons/Metadrop/ddev-lighthouse](https://addons.ddev.com/addons/Metadrop/ddev-lighthouse) 

Adds Lighthouse to run tests

### Installation

``` 
ddev add-on get Metadrop/ddev-lighthouse
ddev restart​
```

### Usage

To use Lighthouse, you must first add the `HTTP` URL in `./tests/lighthouse/local/lighthouserc.js` (e.g.: `'http://shopware-ddev-app.ddev.site'`)

Then start with `ddev lighthouse` and view the report at `./reports/lighthouse/local/_.report.html`.

---

## ddev-mkdocs (works)

[https://addons.ddev.com/addons/Metadrop/ddev-mkdocs](https://addons.ddev.com/addons/Metadrop/ddev-mkdocs)

Mkdocs is a documentation management tool that creates a static page through which you can access documentation in `.md` format

### Installation

``` 
ddev get Metadrop/ddev-mkdocs
ddev restart​
```

### Usage

Simply go to the homepage via port `9005`. Documentation can be placed under `./docs/docs/[filename].md`. These must be registered in the navigation in `./docs/mkdocs.yaml`.

---

## ddev-pa11y (tested)

[https://addons.ddev.com/addons/a11ywatch/ddev-a11ywatch](https://addons.ddev.com/addons/a11ywatch/ddev-a11ywatch) 

Adds the accessibility test tool [pa11y](https://pa11y.org/).

### Installation

``` 
ddev add-on get Metadrop/ddev-pa11y
ddev restart
```

### Usage

To use pa11y, execute the command:

``` 
ddev pa11y <SHOP_DOMAIN> --reporter=junit --standard=WCAG2A
```

The corresponding **report** is saved under `./report`.

pa11y can be **configured** under `tests/pa11y/config.json`

---

## ddev-a11ywatch (tested)

[https://addons.ddev.com/addons/a11ywatch/ddev-a11ywatch](https://addons.ddev.com/addons/a11ywatch/ddev-a11ywatch) 

Adds an Adminer to manage the database

### Installation

``` 
ddev add-on get a11ywatch/ddev-a11ywatch
ddev restart
```

Then start Adminer with `ddev adminer` and open it via port `9101` (check via `ddev describe` if necessary)

---

## ddev-browsersync (not tested)

[https://addons.ddev.com/addons/ddev/ddev-browsersync#overview](https://addons.ddev.com/addons/ddev/ddev-browsersync#overview)

Adds [Browsersync](https://browsersync.io/) to the DDEV project. This is a tool to make changes visible in real-time across multiple browsers or devices – synchronously and automatically!

### Installation

``` 
ddev add-on get ddev/ddev-browsersync
ddev restart
```

Then start Adminer with `ddev adminer` and open it via port `9101` (check via `ddev describe` if necessary)

---

## ddev-buggregator (tested)

[https://addons.ddev.com/addons/iljapolanskis/ddev-buggregator](https://addons.ddev.com/addons/iljapolanskis/ddev-buggregator) 

More information about Buggregator: [https://docs.buggregator.dev/](https://docs.buggregator.dev/)

### Installation

``` 
ddev add-on get iljapolanskis/ddev-buggregator
ddev restart
```

Then open via port `8000` (check via `ddev describe` if necessary)
