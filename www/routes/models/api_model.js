
var titleContent = {title: "Hey there!",
                    subtitle: "Welcome to your premade app!"};

var innerContent = {list: ["angular", "repeat", "example"]};

module.exports.getData = function(encodedParamsObject, callback){

    var paramsObject = decodeURI(encodedParamsObject);
    
    if(paramsObject == "title"){
        callback(titleContent);
    }
    else if(paramsObject == "content"){
        callback(innerContent);
    }
    else{
        callback(null);
    }
};
