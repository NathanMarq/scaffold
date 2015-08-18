## ANGULAR-EXPRESS SCAFFOLD ##

This is a fully fitted server setup with Angular, NodeJS/Express, and Bootstrap.
It is meant to be used as a starting point for webapps, so you can get to working on
your actual app faster.

### System Configs ###

* Uses Grunt Watch, which can be fully appreciated with the [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei/details) plugin in Chrome

**Server Side Dependencies:**
* nginx
* Upstart
* Monit
* Node
	* Express
	* Supervisor

These are all installed when the provisioning bootstrap file runs.

**Front End Dependencies:**
* AngularJS
* Grunt
* Bower
* phantomjs
* tape

Versions of all of these can be found in the www/package.json file and the www/public_src/libs/bower.json file.

### Getting Started ###

**To run this VM, you must have Vagrant installed.**

As an alternative, you can run the bootstrap in your Ubuntu server environment, but replace all the /vagrant dirs with /var.

**After cloning the repo, start up the Vagrant box:**

`vagrant up`

**Then, from your local machine:**

`cd www/public_src/libs`

`bower install`

`cd ../../`

`grunt build`

Navigate to `http://localhost:8082` in your browser to see the action!

**Run grunt watch for live editing/minification:**

`grunt watch`

### Server Editing ###

Node Supervisor should handle server restarts when files change, but just in case you need to restart manually, run:

`sudo stop nodeserver`

`sudo start nodeserver`

Error logs can be found here: `/var/log/nodeserver.sys.log`


### Testing ###

Tests are written using Tape for both server-side and front-end code.

All test files are in the tests/ directory, the subdirectories should match the application directories.

Tests are all included in the Gruntfile and will be run every time an appropriate file is changed.

### About the Server ###

The Node Express server will run as a daemon script, and will restart after reboot using Upstart (installed in the bootstrap. See the nodeserver.conf file for settings).

It is kept running using Monit, which will keep it running through errors and problems (see nodeservermonit.conf for more info)

For development, the Node server uses supervisor to restart when server-related files are changed. Look at the nodeserver.conf file to see which files are being watched for restarts.

One thing I've noticed: When running `vagrant suspend` then `vagrant resume`, supervisor may no longer restart the server when you make changes to your node files. Just run a `sudo stop nodeserver` and a `sudo start nodeserver` to get it updating normally again.

## Live Deployment On AWS ##

### Setting Up EC2 Instance ###

Create an Ubuntu Linux AWS EC2 instance image in the EC2 management console on aws.amazon.com. Set the security group up so that incoming port 22 is available to all or at least your IP/IP group depending on what is needed. Create a second security rule with the 'type' set as 'HTTP' on port 80 and make it available to any incoming IP in order that the web app will be available publicly (if that is the security level you want).

Name and download the `*.pem` key file. 

Next, move the `*.pem` file to .ssh folder for safe keeping. Navigate to where the file was downloaded to and:

`mv *.pem ~/.ssh/`

Then secure the `*.pem` file by:

`sudo chmod 600 *.pem`

When that is finished, the EC2 instance can be sshed into. In order to ease this process, it is best to add your ssh key to the `authorized_keys` file in the EC2 instance. This is not necessary, but will make working with it more simple. If you have set up ssh keys with GitHub you can find your public key at https://github.com/your_username_here.keys

`ssh ~/.ssh/*.pem ubuntu@your_url_here` (url can be found in the AWS EC2 Management Console)

From there you will need to copy your ssh-rsa public key into the file by: 

`cd ~/.ssh/`

`nano authorized_keys`

Then copy and paste your key, including the 'ssh-rsa' piece to the next line in the file, save and exit nano.

### Copying Local Files Onto EC2 Instance ###

The following is assuming you have added your ssh key to the `authorized_keys` file in your instance. If not, you need to add the following immediately after the `scp` command `-i ~/.ssh/*.pem`

Make sure the project is working properly in the Vagrant. When you are ready to put it up, run `grunt build` in the `www/` directory one more time. 

Then, from the `www/` directory:


`scp -r public/ ubuntu@your_url_here:.`

`scp -r routes/ ubuntu@your_url_here:.`

`scp server.js ubuntu@your_url_here:.`

`scp package.json ubuntu@your_url_here:.`

**Do not forget the `:.` after the url.**

When those files have been successful sent up, the bootstrap files need to copied as well. Before doing that make sure to change any references to `/vagrant` in the bootstrap files to `/var`. **This is extremely important.** Don't forget to change them back for local development after copying them to the EC2.

Then from the local project root: 

`scp -r bootstrapping/ ubuntu@your_url_here:.`

Now you need to ssh into the EC2 to put the files into their proper locations.

`ssh ubuntu@your_url_here`

`cd ../../var/`

`mkdir www`

`cd ~`

`sudo mv public/ ../../var/www/`

`sudo mv routes/ ../../var/www/`

`sudo mv server.js ../../var/www/`

`sudo mv package.json ../../var/www/`

_The `sudo` is necessary because of var folder permissions_

`sudo mv bootstrapping/ ../../var/`

### Starting The Server ###

Navigate to the var/ directory inside the EC2 instance. 

`cd bootstrapping`

`sh bootstrap.sh`

If all went correctly, the web application should be available and running publicly at its url. 

In order to see the live node.js console as the server is running to debug if needed: 

`sudo tail -f /var/log/nodeserver.sys.log`




###Credits:###
* Originally based off of [John Longanecker's Angular Skeleton](https://github.com/jlongnbt/angular-skeleton "jlongnbt repo")
* Monit and Upstart setup based off of the tutorial [HERE](http://howtonode.org/deploying-node-upstart-monit)

## @TODO: ##

* add a Monit Cronjob to run periodically, to make sure Monit stays running
