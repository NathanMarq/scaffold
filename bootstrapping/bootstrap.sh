sudo add-apt-repository -y ppa:chris-lea/node.js
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

sudo apt-get install -y unzip curl vim git nginx python-software-properties python g++ make nodejs upstart monit

sudo cp /vagrant/bootstrapping/nodeserver_nginx.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default

sudo ln -s /etc/nginx/sites-available/nodeserver_nginx.conf /etc/nginx/sites-enabled/nodeserver_nginx.conf

sudo service nginx start
sudo service nginx reload

sudo npm config set registry http://registry.npmjs.org/

cd /vagrant/www

sudo npm install
sudo npm install --save -g supervisor

cd /vagrant/bootstrapping


# copy conf files over
sudo cp nodeserver.conf /etc/init/
sudo chmod 777 /etc/init/nodeserver.conf

sudo cp nodeserver_monit.conf /etc/monit/conf.d/
sudo chmod 700 /etc/monit/conf.d/nodeserver_monit.conf

# start the node server daemon
sudo start nodeserver

# start monit for error checking
sudo monit -d 10 -c /etc/monit/conf.d/nodeserver_monit.conf
