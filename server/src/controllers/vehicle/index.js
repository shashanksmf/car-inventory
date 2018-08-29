var app = require('express')

var router = app.Router();

var helpers = require('./helpers');

router.post('/uploadcsv', helpers.uploadCSV);
router.post('/add', helpers.addVehicle);


module.exports = { router, api: [] }
