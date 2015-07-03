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

### Live Deployment ###

Copy all the bootstrapping files up, then change any references to /vagrant in the bootstrap.sh file to /var. Then run it:

`sudo sh bootstrap.sh`

### About the Server ###

The Node Express server will run as a daemon script, and will restart after reboot using Upstart (installed in the bootstrap. See the nodeserver.conf file for settings).

It is kept running using Monit, which will keep it running through errors and problems (see nodeservermonit.conf for more info)

For development, the Node server uses supervisor to restart when server-related files are changed. Look at the nodeserver.conf file to see which files are being watched for restarts.

One thing I've noticed: When running `vagrant suspend` then `vagrant resume`, supervisor may no longer restart the server when you make changes to your node files. Just run a `sudo stop nodeserver` and a `sudo start nodeserver` to get it updating normally again.

###Credits:###
* Originally based off of [John Longanecker's Angular Skeleton](https://github.com/jlongnbt/angular-skeleton "jlongnbt repo")
* Monit and Upstart setup based off of the tutorial [HERE](http://howtonode.org/deploying-node-upstart-monit)

## @TODO: ##

* add a Monit Cronjob to run periodically, to make sure Monit stays running
