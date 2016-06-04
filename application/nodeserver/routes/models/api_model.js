var logger = require('log4js').getLogger('api_model');

var titleContent = {title: "HEY THERE",
                    subtitle: "welcome to your premade app!"};

module.exports.getData = function(encodedParamsObject, callback){

    var paramsObject = decodeURI(encodedParamsObject);

    if(paramsObject === "title"){
        callback(titleContent);
    }
    else{
        callback(null);
    }
};
