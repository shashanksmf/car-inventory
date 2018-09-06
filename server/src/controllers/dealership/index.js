var app = require('express')

var router = app.Router();

var helpers = require('./helpers');

router.post('/add',helpers.addDealership);
router.get('/search',helpers.search);

module.exports = {router, api: []}
