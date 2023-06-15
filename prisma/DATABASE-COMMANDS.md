## Prisma & Pscale Commands

- For datadump:
  `pscale database dump <database> <branch>`

This command will create folder in your pwd and each table will have 2 files ~ one for the schema and other for the data.
These files will be sql scripts to create tables and insert data.

- pscale shell commands to run sql scripts

After opening a mysql shell to our new branch, we can execute the sql script against the database by sourcing it.

Note: Where you opened the mysql shell matters. We'll be using a path on our filesystem relative to where you opened the shell to execute the sql script.

source ./crates/upload-pokemon-data/create-tables.sql

TODO:
Copying filtered data like for a yearonly when production data is 10 yars old etc

brew install mysql-client

brew install planetscale/tap/pscale

connect to your branch
pscale shell zt-housing-scheme development