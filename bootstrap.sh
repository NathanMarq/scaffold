# run iptables forwarding command
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000

# copy over the rc.local file for reboot scripts
sudo cp /vagrant/rc.local /etc/

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
sudo npm install -g forever

# start up node webserver
forever start /vagrant/www/server.js
