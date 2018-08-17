var CronSchedule = require('../../models/Inbound/cronSchedule');
var schedule = require('node-schedule');
var cronJobs = {};
var Provider = require('../../models/Inbound/provider');
var Vehicle = require('../../models/vehicle');
var Task = require('../../models/task');
var csv = require('fast-csv');
var Client = require('ftp');
var mongoose = require('mongoose');

function reScheduleAlreadyStartedJob(job){
   // for re scheduling already  jobs which are vanished because server is restarted;
    cronJobs[job._id] = schedule.scheduleJob(job.expression,function(providerId){
        getProviderFTPDetails(providerId,function(ftpDetails){
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job.providerId));
}

function reScheduleFutureJob(job){
    // for re scheduling future jobs which are not started yet when server is restarted;
    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(job.startDate).getTime(), end: new Date(job.endDate).getTime(), rule: job.expression },function(job){
        if(!cronJobs[job._id]['isStarted']){
            cronJobs[job._id]['isStarted'] = true;
            updateJobScheduleCollectionFlags(job._id);
        }
        getProviderFTPDetails(providerId,function(ftpDetails){
            readFileFromServer(ftpDetails);
        });

    }.bind(null,job));
}

function insertRecordsIntoDB(vehicles,taskObj){
    // inserting vehicle and task obj
    Vehicle.create(vehicles, function (err, result) {
        if (err) return err;
        taskObj['success'] = vehicles.length;
        taskObj['endTime'] = Date.now();

        Task.create(taskObj, function (err, result) {
         // TODO: store header of file if want to debugging
          if (err) return err;
        })
      });
}
function readFileFromServer(ftpDetails){
    var vehicles = [];
    var taskObj = {};
    taskObj['_id'] = new mongoose.Types.ObjectId();
    taskObj['startTime'] = Date.now();
    var headers = {};
    var providerHeaders = {};
    var isFirstLine = true;
    taskObj['file'] = file.name;
    getProviderHeaderFields(function(headers){
        providerHeaders = headers;
    })
      c.connect({
        host: ftpDetails.ftpHost,
        port: 21,
        user: ftpDetails.ftpUsername,
        password: ftpDetails.ftpPassword
      });
      c.on('ready', function() {
        var vehicles = [];

        c.get(ftpDetails.directory + '/' + ftpDetails.filename, function(err, stream) {
          var dataD ;
          if (err) {
            // handle error here   
          }

          stream.once('close', function() {
            // close connection once stream is closed
            c.end();
          });
    
          var csvStream = csv()
            .on("data", function(data) {
                // Push Records Into global Array
                var vehicleObj;
                for(var key in providerHeaders){
                    vehicleObj[key] = data[providerHeaders[key]];
                }
                vehicleObj["_id"] = mongoose.Types.ObjectId();
                vehicleObj["taskID"] = taskObj['_id'];
                vehicles.push(vehicleObj);
                
              
            })
            .on("end", function() {
                // pass vehicle object & task Obj to insert into database
                insertRecordsIntoDB(vehicles , taskObj );
            });
    
          stream.pipe(csvStream);
        });
      });
      c.on('error', function(err) {
        console.log("err", err)
        
      });
    
}
function getProviderHeaderFields(providerId,cb){
    Provider.findOne({_id: providerId},function(err,result){
        if(!err)
            cb(result.headersMapped);
    });
}
function updateIsStartedFlag(jobId){
    CronSchedule.updateOne({_id : jobId},{isStarted : true}, function(err,result){ 
        if(!err)  
            cronJobs[jobId]['isStarted'] = true;
    })
}
function updateIsActiveFlag(jobId){
    CronSchedule.updateOne({_id : jobId},{isActive : false}, function(err,result){   
        if(!err)  
            cronJobs[jobId].cancel();
            delete cronJobs[jobId];
    });
}

function getProviderFTPDetails(providerId,cb){
    Provider.findOne({_id : providerId},function(err,result){
        if(!err){
            cb(result);
        }
    })
}

function scheduleFutureJob(job){
    // scheduling new job for provider
    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(job.startDate).getTime(), end:  new Date(job.endDate).getTime(), rule:'*/1 * * * * * ' },function(job){
        if(!cronJobs[job._id]['isStarted']){
            updateIsStartedFlag(job._id);
        }
        getProviderFTPDetails(job.providerId,function(ftpDetails){
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job));  

    // console.log('Job Stated Obj : ' , job);
    
    // }.bind(null,job));  
    
}

function insertJobIntoDB(job,cb){
    CronSchedule.create(job,function(err,result){
        if(!err)
            cb(true);
        else
            cb(false);
    })
}
function cancelScheduledJob(jobId){
    updateIsActiveFlag(jobId);
}
module.exports = {
    scheduleJob : function(req,res){

       var scheduleObj = {};
       scheduleObj['_id'] = mongoose.Types.ObjectId();
       scheduleObj['providerId'] = req.body.provider;
       scheduleObj['startDate'] = req.body.startDate;
       scheduleObj['endDate'] = req.body.endDate;
       scheduleObj['expression'] = '0 0 */' + req.body.interval + ' * * *';
       scheduleObj['isActive'] = req.body.status;
       
       scheduleFutureJob(scheduleObj);
       insertJobIntoDB(scheduleObj,function(result){
           if(result)
            res.json({result : true, msg : 'New Inbound Job Scheduled Successfully! ', class: 'success'});
           else
            res.json({result: false, msg : 'Error While Scheduling Job ',class : 'danger'});
       }) 
    },
    cancelJob : function(jobId){
        cancelScheduledJob(jobId);
    },
    reScheduleCronJobs : function(){
        CronSchedule.find(function(err,result){
            if(err) throw err;
            result.forEach(function(job){
                if(job.isActive){
                    if(job.isStarted)
                        reScheduleAlreadyStartedJob(job);
                    else
                        reScheduleFutureJob(job);
                }
            })
        })
    },
    getproviders : function(req,res){
        Provider.find(function(err,result){
            if(err) throw err;
            res.json(result);
        })
    }
};