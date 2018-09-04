
var Schedule = {};

var helpers = require('./helpers');

Schedule.bindRoutes = function(router) {

router.post('/schedule/job',helpers.scheduleJob);
router.get('/schedule/job/cancel/:jobId',helpers.cancelJob);
router.get('/schedule/providers',helpers.getproviders);
router.get('/schedule/providers/data',helpers.getProvidersScheduleData);
router.get('/schedule/errors',helpers.getErrors);
router.get('/schedule/history/:scheduleId',helpers.getScheduleHistory);
router.get('/schedule/details/:scheduleId',helpers.getScheduleDetails);
router.get('/schedule/run/:scheduleId',helpers.runCronJob);

}

module.exports = Schedule;
