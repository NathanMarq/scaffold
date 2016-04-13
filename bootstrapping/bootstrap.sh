echo "### Setting up env variables: ###"
if [ -d /vagrant ]
  then
    ENV_USER=vagrant

    sudo rm -rf /var/www
    sudo ln -s /vagrant /var/www
    ROOT_DIR=/vagrant

  else
    ENV_USER=ubuntu
    ROOT_DIR=/var/www
fi

echo "### Copy bash_profile ###"

# copy our fancy bash profile over :)
eval cp /var/www/bootstrapping/.bash_profile "~/"
eval source "~/.bash_profile"

echo "### set up PPA for Node: ###"
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

echo "### Updating apt-get: ###"
sudo apt-get update

# RUN OUR INSTALLS:

# TOOLS
  # unzip
  # curl
  # vim
  # git

# SERVER UTILS
  # nginx - for internal app routing with port forwarding
  # python
  # g++
  # make

# WEBSERVER UTILS
  # nodejs
  # upstart - runs webserver perpetually, after restarts
  # monit - for restarting webserver after crashes, and reporting

echo "### Installing general utils: ###"
sudo apt-get install -y unzip curl vim git nginx python-software-properties python g++ make nodejs build-essential upstart monit

echo "### Copying nginx files: ###"
sudo cp /var/www/bootstrapping/nodeserver_nginx.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default

sudo ln -s /etc/nginx/sites-available/nodeserver_nginx.conf /etc/nginx/sites-enabled/nodeserver_nginx.conf

echo "### Start nginx: ###"
sudo service nginx start
sudo service nginx reload

echo "### Add npm registry: ###"
sudo npm config set registry http://registry.npmjs.org/

cd /var/www/application

echo "### NPM Install: ###"
sudo npm install
sudo npm install --save -g supervisor

cd /var/www/bootstrapping


# copy conf files over
echo "### Copy daemon conf file: ###"
sudo cp nodeserver.conf /etc/init/
sudo chmod 777 /etc/init/nodeserver.conf

echo "### Copy monit conf file: ###"
sudo cp nodeserver_monit.conf /etc/monit/conf.d/
sudo chmod 700 /etc/monit/conf.d/nodeserver_monit.conf

echo "### Starting nodeserver daemon: ###"
# start the node server daemon
sudo start nodeserver

echo "### Starting monit: ###"
# start monit for error checking
sudo monit -d 10 -c /etc/monit/conf.d/nodeserver_monit.conf
