# DevOps Manual

This manual provides essential instructions for database management and media file configuration in the development environment.

## Database Management

### Creating a Database Dump

To create a database dump from the server, SSH into the server and execute the following command in the current project folder:

```bash
shopware-cli project dump [db_name] --username [username] --password '[password]'
```

**Note:** You can retrieve the database credentials by running `cat .env.local` and examining the MySQL URL.

### Importing a Database

You have two options to import a database:

#### Option 1: Using Make Command (Recommended)
```bash
make ddev-import-db
```

#### Option 2: Manual Import via DDEV SSH
Execute the following commands inside the DDEV SSH environment:

```bash
mysql < /var/www/html/.devOps/db/${database}.sql
bin/console database:migrate --all
bin/console database:migrate-destructive --all
bin/console cache:clear
bin/console dal:refresh:index
bin/build-js.sh
```

## Media Files Configuration

The media files are loaded from [Interliving Stage](https://stage.interliving.de/) through the filesystem configuration defined in `config/packages/local/shopware.yaml`. 

### Environment Configuration

- **Local Environment**: Media loading from staging is active when `APP_ENV` is set to `local` (configured in `./.ddev/config.yaml`)
- **Development Environment**: To revert to normal behavior, change `APP_ENV` back to `dev`

### Additional Configuration Notes

- The staging URL and debug mode are configured in `./.ddev/config.yaml`
- The `./public/index.php` file has been modified to handle the local environment as a development environment 
