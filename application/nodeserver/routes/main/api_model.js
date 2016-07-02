const logger = require('log4js').getLogger('api_model');

const titleContent = {title: "HEY THERE",
                    subtitle: "welcome to your premade app!"};

module.exports.getData = (encodedParamsObject, callback) => {

    var paramsObject = decodeURI(encodedParamsObject);

    if(paramsObject === "title"){
        callback(titleContent);
    }
    else{
        callback(null);
    }
};
