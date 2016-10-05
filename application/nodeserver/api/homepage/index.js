const homepage = require('./homepage.js'),
  logger = require('log4js').getLogger('api_controller');

module.exports.attachRestHandlers = (httpApp) => {
  httpApp.get('/api/homepage/title', homepage.getTitle);
};

module.exports.attachSocketHandlers = (io, socket) => {
  socket.on("message:up", (data) => { homepage.messageUp(data, socket, io); });
};
