# DDEV Shopware Shop

<img src="https://ddev.com/logos/dark-ddev.svg" width="150px" height="150px" style="object-fit: scale-down;">

## 🧱 Tech Stack

- Shopware 6.7.2.2
- PHP 8.4
- Node 22
- MySQL 8.0
- ddev

## 🔧 Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [DDEV](https://ddev.readthedocs.io/en/latest/#installation) or [devenv](https://developer.shopware.com/docs/guides/installation/devenv.html)

---

## 🏗️ Setup (ddev)

👉 [Documentation how to set up a shopware project with ddev](https://brandung.atlassian.net/wiki/x/AgBb3AQ)

Clone the project

```bash
git clone git@gitlab.brandung.de:ddev-shopware-shop.git
```

Go to the project directory

```bash
cd ddev-shopware-shop
```

Run initial setup
```bash
make ddev-init
```

Alternative run project setup (or if errors occur)

```bash
make ddev-setup
```

## 🗂️ Database

Import database for local environment

```bash
make ddev-import-db
```

The database is located in `./.devOps/db/*.sql`

### 💻 Commands (ddev)

| Operation          | Command                  |
| ------------------ | ------------------------ |
| Start project      | ```ddev start```         |
| Open ddev shell    | ```dev ssh```            |
| Watch storefront   | ```make ddev-watch```    |
| Build storefront   | ```make ddev-build```    |

### 🛫 Start project

- run `ddev start && ddev ssh` to access the container
- on the first start you may need to change the domains in the main sales channel to `https://ddev-shopware-shop.ddev.site/` and `http://ddev-shopware-shop.ddev.site/`

---

## 🚀 Deployment

[Our deployment process](https://link-to-deployment-process)

- create **develop/staging** branch from **main** branch
- create **release** branch from **main** branch
- create **feature** branch from **main** branch
- merge **feature** into **develop/staging** branch if finished
- when approved merge **feature** branch into **release** branch
- if **release** branch is ready merge into **main** branch and create a new **tag**
- **hotfixes are created from **main** and merged into **develop** and **main** branch

For finished features, a draft merge request is created for the current release. After acceptance, the draft marker is removed

Develop is a release branch for testing on Dev/Stage and should be considered independently of Main. 
Can be overwritten by Main at any time after consultation.

Feature branches are only closed/deleted once they have been deployed to Prod.
