# run iptables forwarding command (for initial load, this is also in the nodeserver.conf file)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000

sudo apt-get update

# tools
sudo apt-get -y install unzip
sudo apt-get -y install curl
sudo apt-get -y install vim
sudo apt-get -y install git


# install the newest version of node
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

sudo npm config set registry http://registry.npmjs.org/

cd /vagrant/www

sudo npm install

# For running node server perpetually, after restarting
sudo apt-get install -y upstart

cd /vagrant

sudo cp nodeserver.conf /etc/init/
sudo chmod 777 /etc/init/nodeserver.conf

# install monit and copy conf file over
sudo apt-get install -y monit
sudo cp nodeservermonit.conf /etc/monit/conf.d/
sudo chmod 700 /etc/monit/conf.d/nodeservermonit.conf

# start the node server daemon
sudo start nodeserver

# start monit for error checking
sudo monit -d 60 -c /etc/monit/conf.d/nodeservermonit.conf
