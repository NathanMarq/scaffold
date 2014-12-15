
sudo apt-get update

# tools
sudo apt-get -y install unzip
sudo apt-get -y install curl
sudo apt-get -y install vim
sudo apt-get -y install git


# we'll use nginx to do our internal app routing with port forwarding
sudo apt-get -y install nginx

sudo cp /var/nodeserver_nginx.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default

sudo ln -s /etc/nginx/sites-available/nodeserver_nginx.conf /etc/nginx/sites-enabled/nodeserver_nginx.conf

sudo service nginx start

# install the newest version of node
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

sudo npm config set registry http://registry.npmjs.org/

cd /var/www

sudo npm install
sudo npm install -g supervisor

# For running node server perpetually, after restarting
sudo apt-get install -y upstart

cd /var

sudo cp nodeserver.conf /etc/init/
sudo chmod 777 /etc/init/nodeserver.conf

# install monit and copy conf file over
sudo apt-get install -y monit
sudo cp nodeservermonit.conf /etc/monit/conf.d/
sudo chmod 700 /etc/monit/conf.d/nodeservermonit.conf

# start the node server daemon
sudo start nodeserver

# start monit for error checking
sudo monit -d 10 -c /etc/monit/conf.d/nodeservermonit.conf
