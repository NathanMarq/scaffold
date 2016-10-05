const logger = require('log4js').getLogger('api_model');

const titleContent = {title: "HEY THERE",
                    subtitle: "welcome to your premade app!"};

const getData = (paramsObject) => {
  return new Promise(function(resolve, reject){
    if(paramsObject === "title"){
      resolve(titleContent);
    }
    else{
      reject({
        message: "No proper parameters used."
      });
    }
  });
};

module.exports.getTitle = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  getData("title")
    .then(function(results){
      res.status(200).send(results);
    })
    .catch(function(error){
      logger.error(error.message + '');
      res.status(500).send(error.message + '');
    });
};

module.exports.messageUp = (message, socket, io) => {
  io.emit("message:down", message);
};
