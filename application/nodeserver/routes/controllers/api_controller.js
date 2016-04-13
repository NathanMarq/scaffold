var apiModel = require('../models/api_model'),
    logger = require('log4js').getLogger('api_controller');

module.exports.controller = function(httpApp){

    httpApp.get('/api/getData/:param', function(request, response){

        var paramsObject = request.params.param;

        try{
            response.setHeader('Content-Type', 'application/json');
            apiModel.getData(paramsObject, function(results){
                response.send(results);
            });
        }
        catch (exception){
            logger.error(exception + '');
            response.send(exception + '');
        }
    });
};
