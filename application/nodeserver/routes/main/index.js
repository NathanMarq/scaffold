const apiModel = require('./api_model'),
    logger = require('log4js').getLogger('api_controller');

module.exports.attachHandlers = (httpApp) => {

    httpApp.get('/api/getData/:param', (request, response) => {

        var paramsObject = request.params.param;

        try{
            response.setHeader('Content-Type', 'application/json');
            apiModel.getData(paramsObject, (results) => {
                response.send(results);
            });
        }
        catch (exception){
            logger.error(exception + '');
            response.send(exception + '');
        }
    });
};
