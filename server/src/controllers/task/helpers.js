var Database = require("./../../database");
var Task = Database.getcollectionSchema('task');
var Vehicle = Database.getcollectionSchema('vehicle');
var History = Database.getcollectionSchema('history');
var moment = require('moment');

module.exports = {
    
 getTask :  function(req, res) {
   /*  Task.find(function(err, result) {
      res.json(result);
    }); */
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    History.find().sort({lastRun  : -1}).lean()
    .then(result => {
        res.json(result);
    }).catch(error => {
       res.json([]);
    })
  },
  getTasksVehicles : function(req, res) {
    const taskId = req.params.taskId;
    Vehicle.find({
      taskID: taskId
    }, function(err, result) {
      res.json(result);
    });
  }
}
