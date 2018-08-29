var Routes = {};
var bodyParser = require('body-parser');

Routes.bindRoutes = function () {
  Routes.middlewares();
  Routes.api();
  Routes.utils();
  Routes.statics();
  Routes.errorHandler();
}
Routes.api = function() {
  
  app.use('/inbound', require('./controllers/inbound').router);
  app.use('/outbound', require('./controllers/outbound').router);
  // app.use('/provider', require('./controllers/provider').router);
  app.use('/task', require('./controllers/task').router);
  app.use('/vehicle', require('./controllers/vehicle').router);
  app.use('/ftp', require('./controllers/ftp').router);

}

Routes.utils = function () {
  var template = require('./utils/template');
  app.get('/template', template.get);
};


Routes.middlewares = function () {
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());


};
Routes.statics = function() {


}
Routes.errorHandler = function () {

}
// Routes.start = function() {
//     app.listen(3001, () => console.log(
//     'Example app listening on port ' + 3001));
// }

module.exports = Routes;
