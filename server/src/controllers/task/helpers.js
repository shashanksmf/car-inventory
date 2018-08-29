var Database = require("./../../database");
var Task = Database.getcollectionSchema('task');
var Vehicle = Database.getcollectionSchema('vehicle');

module.exports = {
    
 getTask :  function(req, res) {
    Task.find(function(err, result) {
      res.json(result);
    });
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
