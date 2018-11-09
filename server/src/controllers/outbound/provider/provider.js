
var helpers = require('./helpers');

var Provider = {};

Provider.bindRoutes = function (router) {
    router.get('/provider/orignal/headers', helpers.getOrignalHeaders);
    router.post('/provider/add', helpers.addProvider);
    router.get('/provider/view',helpers.getProviderInfo);
    router.post('/provider/file/headers', helpers.getProviderHeaders);
    router.get('/provider/data/processed/today', helpers.getTodaysProvidersData);
    router.get('/provider/data', helpers.getProvidersDetails);
}
module.exports = Provider;
