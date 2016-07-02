echo "### parameter 1: ###"

echo -e "\n######## setting up postgres apt repo... ########\n"
# setup postgres/gis
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" >> /etc/apt/sources.list'
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add -

echo "### Updating apt-get: ###"
sudo apt-get update
sudo apt-get -y upgrade

echo -e "\n######## installing Postgresql-9.5-postgis and postgresql-contrib... ########\n"
sudo apt-get -y install Postgresql-9.5-postgis postgresql-contrib

echo -e "\n######## starting to create the postgis extension... ########\n"
sudo -u postgres psql -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -c "CREATE EXTENSION postgis_topology;"

echo -e "\n######## installing a bunch of postgres stuff: ########\n"
echo -e "\n######## installing postgresql-client-common: ########\n"
# install a bunch of postgres stuff
sudo apt-get -y install postgresql-client-common
echo -e "\n######## installing postgresql-client-9: ########\n"
sudo apt-get -y install postgresql-client-9.5
echo -e "\n######## installing python-software-properties: ########\n"
sudo apt-get -y install python-software-properties
# echo -e "\n######## adding apt-get repo ubuntugus and georepublic: ########\n"
# sudo add-apt-repository -y ppa:ubuntugis/ubuntugis-unstable
# sudo add-apt-repository -y ppa:georepublic/pgrouting

echo -e "\n######## creating databases and users... ########\n"
sudo -u postgres psql -c "CREATE DATABASE ${MAIN_DB};";
sudo -u postgres psql -c "CREATE USER ${MAIN_DB} WITH PASSWORD '${MAIN_PASS}';";
sudo -u postgres psql -c "ALTER USER ${MAIN_DB} CREATEDB;";

sudo -u postgres psql -c "GRANT ALL PRIVILEGES on DATABASE ${MAIN_DB} to ${MAIN_DB};"

sudo cp /var/www/bootstrapping/extras/bin_postgresql/pg_hba.conf /etc/postgresql/9.5/main/
sudo cp /var/www/bootstrapping/extras/bin_postgresql/postgresql.conf /etc/postgresql/9.5/main/

echo -e "\n######## restarting postgresql... ########\n"
sudo service postgresql restart
