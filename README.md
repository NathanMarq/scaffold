## ANGULAR-EXPRESS SCAFFOLD ##

This is a fully fitted server setup with Angular, NodeJS/Express, and Bootstrap.
It is meant to be used as a starting point for webapps, so you can get to working on
your actual app faster.

### System Configs ###

**Created and Tested With:**

* Mac OSX 10.9.2
* Virtualbox 4.3.8 r92456
* Vagrant 1.4.3
* Grunt v0.1.13
* Bower version 1.2.8

* Uses Grunt Watch, which can be fully appreciated with the [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei/details) plugin in Chrome

**Server Side Dependencies:**

* Node v0.10.26
	* Express

These are all installed when you run the bootstrap file. Specific versions of the node modules can be found in the www/package.json file.

**Front End Dependencies:**
* AngularJS

Versions of all of these can be found in the package.json file and the bower.json file.

### Getting Started ###

**To run this VM, you should have Vagrant installed. It makes things easier.**

As an alternative, you can run the live versions of the bootstrap and setup confs(found in the livescripts directory) in your Ubuntu server environment.

**After cloning the repo, start up the Vagrant box:**

`vagrant up`

`vagrant ssh`

`cd /vagrant`

`sh bootstrap.sh`

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

### Live Deployment ###

For the live versions of the bootstrap and config files, look in the livescripts directory.

The .conf files should go into the /var directory, and the bootstrap.sh file should be in the /var/www directory.

### About the Server ###

The node Express server will run as a daemon script, and will restart after reboot using Upstart (installed in the bootstrap. See the nodeserver.conf file for settings).

It is kept running using Monit, which will keep it running through errors and problems (see nodeservermonit.conf for more info)

For development, the Node server uses supervisor to restart when server-related files are changed. Look at the nodeserver.conf file to see which files are being watched for restarts.

###Credits:###
* Originally based off of [John Longanecker's Angular Skeleton](https://github.com/jlongnbt/angular-skeleton "jlongnbt repo")
* Monit and Upstart setup based off of the tutorial [HERE](http://howtonode.org/deploying-node-upstart-monit)

## @TODO: ##

* add a Monit Cronjob to run periodically, to make sure Monit stays running
