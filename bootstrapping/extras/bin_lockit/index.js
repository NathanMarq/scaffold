const config = require("config");
const Lockit = require('lockit');
const utils = require('lockit-utils');
const logger = require('log4js').getLogger('nbt_auth');
const pgp = require('pg-promise')(require("../../config/pgpOptions").attach(logger));

exports.attachHandlers = (router) => {
  var lockit = new Lockit(config.get("lockit"));
  router.use(lockit.router);
  router.use('/api', utils.restrict(config.get("lockit")));

  lockit.router.get('/rest/isloggedin', utils.restrict(lockit.config), (req, res) => {
    if(req.session.name){
      res.send({ name: req.session.user });
    }
    else{
      res.status(401).send({});
    }
  });

  lockit.router.get('/rest/whoami', utils.restrict(lockit.config), (req, res) => {
    if(req.session.name){
      return res.json({ name: req.session.user });
    }
    else{
      return res.status(400).json({ error: "user not logged in" });
    }
  });

  router.get('/api/authorized', (req, res) => {
    if(req.session.loggedIn){
      res.status(200).end();
    }
  });

  router.get('/api/getUserInfo', (request, response, next) => {
    var db = pgp(config.get("database.connString"));

    db.one(`
      select * from users where name = $1;
      `,
    [ request.session.name ])
      .then((results) => {
        response.send({
          name: results.name,
          email: results.email
        });
      },
      (reason) => {

      });
  });

  lockit.on('signup', (user, res) => {
    logger.info('a new user signed up');
    res.status(201).send('Welcome!');   // set signup.handleResponse to 'false' for this to work
  });

  lockit.on('login', (user, res, target) => {
    res.req.session.user = {
                  id: user._id,
                  email: user.email,
                  name: user.name
                };

    res.json({name: user.name});
  });

  lockit.on('logout', (user, res) => {
    logger.info(user.name + ' logged out.');
    res.json({"message": 'logged out!'});
  });

  lockit.on('delete', (user, res) => {

  });

};
