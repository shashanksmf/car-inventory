var app = require('express')

var router = app.Router();

var helpers = require('./helpers');

router.get('/getFile',helpers.downloadFile);
router.get('/uploadFile', helpers.uploadFile);
router.post('/testconnection', helpers.testFTP);

module.exports = {router, api: []}
