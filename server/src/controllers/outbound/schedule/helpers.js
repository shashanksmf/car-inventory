var mongoose = require('mongoose');
var schedule = require('node-schedule');
var cronJobs = {};

var Database = require("./../../../database");
var Schedule = Database.getcollectionSchema('schedule');
var Provider = Database.getcollectionSchema('provider');
var History = Database.getcollectionSchema('history');
var Vehicle = Database.getcollectionSchema('vehicle');

var csv = require('fast-csv');
var Client = require('ftp');
var mongoose = require('mongoose');
var moment = require('moment');

function calculateNextLastRun(scheduleObj,added = 0){
    var output = {};
    var hours = scheduleObj.interval;
   
    output.lastRunDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss')).getTime();
    if(hours == 100)
        output.nextRunDate = output.lastRunDate + (1 * 60 * 1000 );
    else
        output.nextRunDate = output.lastRunDate + ( hours * 60 * 60 * 1000 );
    if(!scheduleObj.isStarted)
        output.lastRunDate = undefined;
    Schedule.updateOne({_id : scheduleObj._id},{nextRun : output.nextRunDate, lastRun : output.lastRunDate }, function(err,result){ 
        Provider.updateOne({_id : scheduleObj.providerId},{nextRun : output.nextRunDate, lastRun : output.lastRunDate, added : added  }, function(err,result){ 
        //    console.log('Added Added');
       })
    });
    return output;
}
function updateLastNextRun(ftpDetails,added){
    Schedule.findOne({_id : ftpDetails.jobId},function(err,result){
        // var hours = result.interval;
        // var lastRunDate = new Date(moment.utc(new Date()).format(')).getTime();
        // var nextRunDate;
        // if(hours == 100)
        //     nextRunDate = lastRunDate + (1 * 60 * 1000 );
        // else
        //     nextRunDate = lastRunDate + ( hours * 60 * 60 * 1000 );
        var calculated = calculateNextLastRun(result,added);
        var obj = {};
        obj['_id'] = new mongoose.Types.ObjectId();
        obj['lastRun'] = calculated.lastRunDate;
        obj['nextRun'] =  calculated.nextRunDate;
        obj['providerId'] = ftpDetails._id;
        obj['providerName'] = ftpDetails.providerName;
        obj['type'] = 2;
        obj['added'] = added;
        obj['providerType'] = 2;
        insertHistory(obj);
    })
}

function reScheduleJob(job,isStarted = false){
   // for re scheduling already  jobs which are vanished because server is restarted;
   
   // get local time with respect to utc time stored into db taken from client at time of scheduling

    var utcStartDate = moment.utc(moment(job.startDate).format('YYYY-MM-DD HH:mm:ss')).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule: job.expression },function(job){
        
        if(!cronJobs[job._id]['isStarted']){
            cronJobs[job._id]['isStarted'] = true;
            updateIsStartedFlag(job._id);
        }
       
        getProviderFTPDetails(job.providerId,function(ftpDetails){
            ftpDetails.jobId = job._id;
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job));
    // cronJobs[job._id]['isStarted'] = isStarted;
}


function insertRecordsIntoDB(vehicles){
    // inserting vehicle and task obj
    Vehicle.create(vehicles, function (err, result) {
            if (err) return err;
      });
}
function readFileFromServer(ftpDetails){
    var c = new Client();
    var added = 0;
    getProviderHeaderFields(ftpDetails._id,function(providerHeaders){
        // if(currentProvider.id != ftpDetails._id){
        //     currentProvider.id = ftpDetails._id;
        //     currentProvider.added = 0;
        // }

        c.connect({
            host: ftpDetails.ftpHost,
            port: 21,
            user: ftpDetails.ftpUsername,
            password: ftpDetails.ftpPassword
          });
          c.on('ready', function() {
            var vehicles = [];
            var isFirstLine = true;
            c.get(ftpDetails.directory + '/' + ftpDetails.filename, function(err, stream) {
              var dataD ;
              if (err) {
                // handle error here   
              }
    
              stream.once('close', function() {
                // close connection once stream is closed
                c.end();
              });
              
              csv.fromStream(stream, {
                headers: true,
                ignoreEmpty: true,
              })
                .on("data", function(data) {
                   
                    var vehicleObj = {};
                    for(var key in providerHeaders){
                        if(providerHeaders[key])
                            vehicleObj[headers[key]] = data[providerHeaders[key]];
                    }
                    vehicleObj["_id"] = mongoose.Types.ObjectId();
                    // Push Records Into global Array

                    vehicles.push(vehicleObj);
                    // currentProvider.added++;
                    added++;
                  
                })
                .on("end", function() {
                    updateLastNextRun(ftpDetails,added);
                    // pass vehicle object & task Obj to insert into database
                    insertRecordsIntoDB(vehicles );
                });
        
            });
          });
          c.on('error', function(err) {
            console.log("err", err)
            
          });
    })   
}
function insertHistory(obj){
    History.create(obj,function(err,result){
        
    });
}
function getProviderHeaderFields(providerId,cb){
    Provider.findOne({_id: providerId},function(err,result){
        if(!err){
            delete result.headersMapped['$init'];
            cb(result.headersMapped);
        }
            
    });
}
function updateIsStartedFlag(jobId, flag = true){
    Schedule.updateOne({_id : jobId},{isStarted : flag}, function(err,result){ 
        if(!err)  
            cronJobs[jobId]['isStarted'] = true;
    })
}
function updateIsActiveFlag(jobId,cb){

    Schedule.updateOne({_id : jobId},{isActive : false}, function(err,result){   
        if(!err)  
           { 
             cronJobs[jobId].cancel();
            // updating db isStarted field to false
             Schedule.updateOne({_id : jobId},{isStarted : false}, function(err,result){ 
                if(!err)  {
                    cronJobs[jobId]['isStarted'] = true;
                    delete cronJobs[jobId];
                }
            })
             cb(true);
            }
            else
            cb(false);
    });
}

function getProviderFTPDetails(providerId,cb){
    Provider.findOne({_id : providerId} ,function(err,result){
        if(!err){
            cb(result);
        }
    })
}


function scheduleFutureJob(job){
    // scheduling new job for provider
    // get local time with respect to utc time stored into db taken from client at time of scheduling
   /*  var utcStartDate = moment.utc(job.startDate).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss'); */
    var utcStartDate = moment.utc(moment(job.startDate).format('YYYY-MM-DD HH:mm:ss')).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule:job.expression },function(job){
        if(!cronJobs[job._id]['isStarted']){
            updateIsStartedFlag(job._id);
        }
        getProviderFTPDetails(job.providerId,function(ftpDetails){
            ftpDetails.jobId = job._id;
            // ftpDetails.myId = job.myId
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job));  
}

function insertJobIntoDB(job,cb){
    Schedule.create(job,function(err,result){
        if(!err)
            cb(true);
        else
            cb(false);
    })
}
function cancelScheduledJob(jobId,cb){
    updateIsActiveFlag(jobId,function(result){
        cb(result);
    });
    
}
module.exports = {
    scheduleJob : function(req,res){

       var scheduleObj = {};
       scheduleObj['_id'] = mongoose.Types.ObjectId();
       scheduleObj['providerId'] = req.body.provider;
    //    scheduleObj['timezone'] = req.body.timezone;
       scheduleObj['startDate'] = req.body.utcStartDate;
//    scheduleObj['endDate'] = req.body.endDate;
       scheduleObj['interval'] = req.body.interval;
       if(scheduleObj['interval'] == 100)
         scheduleObj['expression'] = '0 */1 * * * * ';
        else
        scheduleObj['expression'] = '0 0 */' + req.body.interval + ' * * *';

       scheduleObj['isActive'] = req.body.status;
       scheduleObj['type'] = 2;

       scheduleFutureJob(scheduleObj);
       insertJobIntoDB(scheduleObj,function(result){
           if(result){
            var calculated = calculateNextLastRun(scheduleObj);
            res.json({result : true, msg : 'New Outbound Job Scheduled Successfully! ', class: 'success'});
           }
           else
            res.json({result: false, msg : 'Error While Scheduling Job ',class : 'danger'});
       }) 
    },
    cancelJob : function(req,res){
        var jobId = req.params.jobId;
        cancelScheduledJob(jobId,function(result){
            if(result)
                res.json({result : true, msg : 'Outbound Provider Schedule Canceled Successfully!', class: 'success'});
            else
                res.json({result : false, msg : 'Error While Canceling Schedule', class: 'danger'});
        });
    },
    reScheduleCronJobs : function(){
        Schedule.find({ isActive: true, type : 2 },function(err,result){
            if(err) throw err;
            result.forEach(function(job){
                if(job.isStarted)
                    reScheduleJob(job,true);
                else
                    reScheduleJob(job);
            })
                
        })
    },
    getproviders : function(req,res){
        Provider.find(function(err,result){
            if(err) throw err;
            res.json(result);
        })
    },
    getProvidersScheduleData : function(req,res){
        Schedule.aggregate(
            [
                {
                    $match: {
                        isActive : true,
                        type : 2    
                    }
                },
        
                {
                    $lookup: {
                        "from" : "provider",
                        "localField" : "providerId",
                        "foreignField" : "_id",
                        "as" : "providersData"
                    }
                }
        
            ],function(err,result){
                if(!err)
                    res.json({result : true, data : result});
                else
                    res.json({result : false, msg : 'Error While Fetching Schedule Data!'});
            });
        
    }
};