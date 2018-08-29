var app = require('express')

var router = app.Router();

var helpers = require('./helpers');



router.get('/get', helpers.getTask);
router.get('/:taskId', helpers.getTasksVehicles);



module.exports = { router, api: [] }
