var Routes = {};

Routes.bindRoutes = function () {
  Routes.middlewares();
  Routes.api();
  Routes.utils();
  Routes.statics();
  Routes.errorHandler();
}
Routes.api = function() {
  app.use('/api/inbound', require('./controllers/inbound').router);
  // app.use('/api/outbound', require('./controllers/outbound').router);
  // app.use('/api/provider', require('./controllers/provider').router);
  // app.use('/api/schedule', require('./controllers/schedule').router);
  app.use('/api/vehicle', require('./controllers/vehicle').router);
}

Routes.utils = function () {

  var template = require('./utils/template');
  app.get('/template', template.get);
};


Routes.middlewares = function () {



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
