var app = require('express')
var router = app.Router();
// var helpers = require('.sch/helpers');

var schedule = require("./schedule/schedule.js");
var provider = require("./provider/provider.js");

// var provider = require("./provider");
// var schedule = require("./schedule");
// var schedule = require("./schedule");

schedule.bindRoutes(router);
provider.bindRoutes(router);
// schedule.bindRoutes(router);
// schedule.bindRoutes(router);
// schedule.bindRoutes(router);


module.exports = {router, api: []}
