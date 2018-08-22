var CronSchedule = require('../../models/Inbound/cronSchedule');
var schedule = require('node-schedule');
var cronJobs = {};
var Provider = require('../../models/Inbound/provider');
var History = require('../../models/history');
var Vehicle = require('../../models/vehicle');
var Task = require('../../models/task');
var csv = require('fast-csv');
var Client = require('ftp');
var mongoose = require('mongoose');
var moment = require('moment');

function calculateNextLastRun(scheduleObj,added = 0){
    var output = {};
    var hours = scheduleObj.interval;
   
    output.lastRunDate = new Date(moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss A')).getTime();
    if(hours == 100)
        output.nextRunDate = output.lastRunDate + (1 * 60 * 1000 );
    else
        output.nextRunDate = output.lastRunDate + ( hours * 60 * 60 * 1000 );
    if(!scheduleObj.isStarted)
        output.lastRunDate = undefined;
    Provider.updateOne({_id : scheduleObj.providerId},{nextRun : output.nextRunDate, lastRun : output.lastRunDate, added : added  }, function(err,result){ 
        // if(!err)
        //     // console.log('Date Updated!');
            
    });
    return output;
}
function updateLastNextRun(providerId,added,providerName){
    CronSchedule.findOne({providerId : providerId},function(err,result){
        // var hours = result.interval;
        // var lastRunDate = new Date(moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss A')).getTime();
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
        obj['providerId'] = providerId;
        obj['providerName'] = providerName;
        obj['type'] = 1;
        obj['added'] = added;
        insertHistory(obj);
        /* Provider.updateOne({_id : providerId},{nextRun : calculated.nextRunDate, lastRun : calculated.lastRunDate, added : added  }, function(err,result){ 
            // if(!err)
            //     // console.log('Date Updated!');
                
        }); */
    })
}

function reScheduleJob(job,isStarted = false){
   // for re scheduling already  jobs which are vanished because server is restarted;
   
   // get local time with respect to utc time stored into db taken from client at time of scheduling
    // console.log('Current Time : ' , new Date());
    // console.log('UTC Start : ' , job.startDate);

    var utcStartDate = moment.utc(job.startDate).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss A');

    // console.log('Local Start : ' , startDate);
    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule: job.expression },function(providerId){
        
        if(!cronJobs[job._id]['isStarted']){
            cronJobs[job._id]['isStarted'] = true;
            updateIsStartedFlag(job._id);
        }
       
        getProviderFTPDetails(providerId,function(ftpDetails){
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job.providerId));
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
        if(currentProvider.id != ftpDetails._id){
            currentProvider.id = ftpDetails._id;
            currentProvider.added = 0;
        }

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
                    updateLastNextRun(ftpDetails._id,added,ftpDetails.providerName);
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
    CronSchedule.updateOne({_id : jobId},{isStarted : flag}, function(err,result){ 
        if(!err)  
            cronJobs[jobId]['isStarted'] = true;
    })
}
function updateIsActiveFlag(jobId,cb){

    CronSchedule.updateOne({_id : jobId},{isActive : false}, function(err,result){   
        if(!err)  
           { 
             cronJobs[jobId].cancel();
            // updating db isStarted field to false
             CronSchedule.updateOne({_id : jobId},{isStarted : false}, function(err,result){ 
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
    var utcStartDate = moment.utc(job.startDate).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss A');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule:job.expression },function(job){
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
       scheduleObj['startDate'] = new Date(req.body.utcStartDate).getTime();
//    scheduleObj['endDate'] = req.body.endDate;
       scheduleObj['interval'] = req.body.interval;
       if(scheduleObj['interval'] == 100)
         scheduleObj['expression'] = '0 */1 * * * * ';
        else
        scheduleObj['expression'] = '0 0 */' + req.body.interval + ' * * *';

       scheduleObj['isActive'] = req.body.status;
       
       var calculated = calculateNextLastRun(scheduleObj);

       scheduleFutureJob(scheduleObj);
       insertJobIntoDB(scheduleObj,function(result){
           if(result)
            res.json({result : true, msg : 'New Inbound Job Scheduled Successfully! ', class: 'success'});
           else
            res.json({result: false, msg : 'Error While Scheduling Job ',class : 'danger'});
       }) 
    },
    cancelJob : function(req,res){
        var jobId = req.params.jobId;
        cancelScheduledJob(jobId,function(result){
            if(result)
                res.json({result : true, msg : 'Inbound Provider Schedule Canceled Successfully!', class: 'success'});
            else
                res.json({result : false, msg : 'Error While Canceling Schedule', class: 'danger'});
        });
    },
    reScheduleCronJobs : function(){
        CronSchedule.find(function(err,result){
            if(err) throw err;
            result.forEach(function(job){
                if(job.isActive){
                    if(job.isStarted)
                        reScheduleJob(job,true);
                    else
                        reScheduleJob(job);
                }
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
        CronSchedule.aggregate(
            [
                {
                    $match: {
                        isActive : true
                    }
                },
        
                {
                    $lookup: {
                        "from" : "providers",
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