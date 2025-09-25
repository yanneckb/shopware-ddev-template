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
	ddev exec shopware-cli project storefront-watch --only-custom-static-extensions

ddev-admin:
	ddev exec shopware-cli project admin-watch --only-custom-static-extensions

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

# Exprot database
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