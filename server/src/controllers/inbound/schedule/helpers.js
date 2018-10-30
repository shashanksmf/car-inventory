var mongoose = require('mongoose');
var schedule = require('node-schedule');
var cronJobs = {};
var fs = require('fs');

var Database = require("./../../../database");
var Schedule = Database.getcollectionSchema('schedule');
var Provider = Database.getcollectionSchema('provider');
var History = Database.getcollectionSchema('history');
var Vehicle = Database.getcollectionSchema('vehicle');
var Dealer = Database.getcollectionSchema('dealer');
var Error = Database.getcollectionSchema('error');
var OutboundAdded = Database.getcollectionSchema('outboundAdded')

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
   /*  Provider.updateOne({_id : scheduleObj.providerId},{nextRun : output.nextRunDate, lastRun : output.lastRunDate, added : added  }, function(err,result){ 
       
    }); */
    Schedule.updateOne({_id : scheduleObj._id},{nextRun : output.nextRunDate, lastRun : output.lastRunDate }, function(err,result){ 
        Provider.updateOne({_id : scheduleObj.providerId},{nextRun : output.nextRunDate, lastRun : output.lastRunDate, added : added  }, function(err,result){ 
        //    console.log('Added Added');
       })
    });
    return output;
}
function updateLastNextRun(ftpDetails,added,error,errorObj,addedIds){
    Schedule.findOne({_id : ftpDetails.jobId},function(err,result){
        // var hours = result.interval;
        // var lastRunDate = new Date(moment.utc(new Date()).format(')).getTime();
        // var nextRunDate;
        // if(hours == 100)
        //     nextRunDate = lastRunDate + (1 * 60 * 1000 );
        // else
        //     nextRunDate = lastRunDate + ( hours * 60 * 60 * 1000 );
        if(!err && result){
            var calculated = calculateNextLastRun(result,added);
            var obj = {};
            obj['_id'] = new mongoose.Types.ObjectId();
            obj['lastRun'] = calculated.lastRunDate;
            obj['nextRun'] =  calculated.nextRunDate;
            obj['providerId'] = ftpDetails._id;
            obj['providerName'] = ftpDetails.providerName;
            obj['type'] = 1;
            obj['error'] = error;
            obj['added'] = added;
            obj['providerType'] = 1;
            obj['scheduleId'] = result._id;
            obj['addedIds'] = addedIds;
            obj['filename'] = extractFilename(ftpDetails.directory);
            insertHistory(obj,errorObj);
        }else{
            console.error(err);
        }
        /* Provider.updateOne({_id : providerId},{nextRun : calculated.nextRunDate, lastRun : calculated.lastRunDate, added : added  }, function(err,result){ 
            // if(!err)
            //     // console.log('Date Updated!');
                
        }); */
    })
}

function reScheduleJob(job,isStarted = false){
   // for re scheduling already  jobs which are vanished because server is restarted;
   
   // get local time with respect to utc time stored into db taken from client at time of scheduling

    var utcStartDate = moment.utc(moment(job.startDate).format('YYYY-MM-DD HH:mm:ss')).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule: job.expression },function(job){
            executeCronJob(job);
    }.bind(null,job));
    // cronJobs[job._id]['isStarted'] = isStarted;
}

function executeCronJob(job){
    if(!cronJobs[job._id]['isStarted']){
        cronJobs[job._id]['isStarted'] = true;
        updateIsStartedFlag(job._id);
    }
   
    getProviderFTPDetails(job.providerId,function(ftpDetails){
        ftpDetails.jobId = job._id;
        readFileFromServer(ftpDetails);
    });
}

function insertRecordsIntoDB(vehicles, dealerObj,updateLNRObj){
    // inserting vehicle and task obj
    Vehicle.create(vehicles, function (err, vehicles) {
            if (err) return err;
            let addedIds = [];
            if(vehicles && vehicles.length)
                vehicles.forEach(vehicle => {
                    addedIds.push(vehicle._id);
                })
            updateLastNextRun(updateLNRObj.ftpDetails,updateLNRObj.added, updateLNRObj.error, updateLNRObj.errorObj,addedIds)
      });
      
    Dealer.create(dealerObj, function(err, result){
        if (err) throw err;
    })
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
            var dealersIds = {};
            var index = 0;
            c.get(ftpDetails.directory, function(err, stream) {
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
                .on("data",  function(data2) {
                    var data = {};
                    for(var key in data2){
                        data[key.replace(/['"]+/g, '').trim()] = data2[key];
                    }
                    var vehicleObj = {};
                    for(var key in providerHeaders){
                        if(providerHeaders[key]){
                            var value = data[providerHeaders[key]];
                            vehicleObj[headers[key]] = value;
                            if(key == 'DealerId')
                                dealersIds[value.trim()] = value.trim();
                        }
                        

                    }
                    vehicleObj["_id"] = mongoose.Types.ObjectId();
                    vehicleObj['providerId'] = ftpDetails._id;
                    // Push Records Into global Array

                    vehicles.push(vehicleObj);
                    // currentProvider.added++;
                    added++;
                  
                })
                .on("end", async function() {
                    var dealerObj = [];
                    var errorObj = [];

                    for(var key in dealersIds){
                        var result =  await Dealer.findOne({
                                            dealerId : dealersIds[key],
                                            providerId : { $ne : ftpDetails._id } });
                        if(result){
                            delete dealersIds[key];
                        }else{
                            var result2 =  await Dealer.findOne({
                                dealerId : dealersIds[key],
                                providerId : ftpDetails._id });
                            if(!result2)
                                dealerObj.push({_id : mongoose.Types.ObjectId() ,providerId : ftpDetails._id, dealerId : dealersIds[key]});
                        }
                    }
                    var vehicleNew = []; 
                    var error = 0;
                    vehicles.forEach(function(item,j){
                        if(dealersIds[item.DealerId]) {
                            vehicleNew.push(item);
                        }else{
                            error++;
                            errorObj.push({ _id :  mongoose.Types.ObjectId(), 
                                error : item.DealerId + ' DealerId Is Already Belongs To other Provider. ',
                                directory : ftpDetails.directory,
                                rowNo : j });
                        }
                    });
                    // updateLastNextRun(ftpDetails,vehicleNew.length, error, errorObj);
                    const updateLNRObj = { ftpDetails, added : vehicleNew.length,error,errorObj}
                    insertRecordsIntoDB(vehicleNew, dealerObj,updateLNRObj);
                });
        
            });
          });
          c.on('error', function(err) {
            console.log("err", err)
            
          });
    })   
}

function insertHistory(obj,errorObj){
    History.create(obj,function(err,result){
        if(!err)
            insertErrors(errorObj,obj['_id']);

    });
}
function insertErrors(errorObj,historyId){
    errorObj.forEach(function(item,i){
        errorObj[i]['historyId'] = historyId;
    });
    Error.create(errorObj,function(err,result){
    });
}
function getProviderHeaderFields(providerId,cb){
    Provider.findOne({_id: providerId},function(err,result){
        if(!err && result){
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
             if(cronJobs[jobId]) cronJobs[jobId].cancel();
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
            readFileFromServer(ftpDetails);
        });
    }.bind(null,job));  

    // console.log('Job Stated Obj : ' , job);
    
    // }.bind(null,job));  
    
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
function extractFilename(path){
    let pathsArr = path.split('/');
    return  pathsArr[pathsArr.length - 1];
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
       scheduleObj['type'] = 1;


       scheduleFutureJob(scheduleObj);
       insertJobIntoDB(scheduleObj,function(result){
           if(result){
            var calculated = calculateNextLastRun(scheduleObj);
            res.json({result : true, msg : 'New Inbound Job Scheduled Successfully! ', class: 'success'});
           }
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
        Schedule.find({ isActive: true, type : 1 },function(err,result){
            if(!err && result){
                result.forEach(function(job){
                    if(job.isStarted)
                        reScheduleJob(job,true);
                    else
                        reScheduleJob(job);
                })
            }else{
                console.error(err);
                
            }
            
                
        })
    },
    runCronJob : function(req,res){
        var scheduleId = req.params.scheduleId;
        Schedule.find({ _id : scheduleId, isActive: true, type : 1 },function(err,result){
            if(!err && result){
                var job = result[0];
                job.startDate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                // cronJobs[job._id].cancel(); delete cronJobs[job._id];
                executeCronJob(job);
                if(err) throw err;
                if(job.isStarted)
                    reScheduleJob(job,true);
                else
                    reScheduleJob(job);

                res.json({result : 1, msg : 'Schedule Started Successfully!'});
            }else{
                res.json({result :  0, msg : 'Error while Starting schedule!'});
            }
        })
    },
    getproviders : function(req,res){
        Provider.find({providerType : 1},function(err,result){
            if(err) console.error(err);
            res.json(result);
        })
    },
    getErrors : function(req,res){
        var historyId = req.query.historyId;
        Error.find({historyId: historyId},function(err,result){
            if(err)
                res.json({result : 0, msg : 'No errors found'});
            else
                res.json({result : 1, error : result});
        });
    },
    getAdded : function(req,res){
        var historyId = req.query.historyId;
        if(historyId){
            History.findOne({_id:  historyId},function(err,result){
                if(!err && result){
                    Vehicle.find({_id : { $in : result.addedIds}}).lean()
                    .then(vehicles => {
                        if(vehicles.length)
                            res.json({result : 1, addeds : vehicles});
                        else{
                            OutboundAdded.find({_id : { $in : result.addedIds}}).lean()
                                .then(vehicles => {
                                    if(vehicles.length)
                                        res.json({result : 1, addeds : vehicles});
                                    else
                                        res.json({result : 0, msg : ' No Vehicles Found!'});

                                }).catch(error => {
                                    res.json({result : 0 , msg : 'No Vehicles Found!'});
                                })
                        }
                    }).catch(error => {
                            res.json({result : 0 , msg : 'No Vehicles Found!'});
                    })
                }else
                    res.json({result : 0, msg : 'No History Found : ' + err})
                
            });
        }else{
            res.json({result : 0, msg : 'Invalid Input'})
        }
    },
    getProvidersScheduleData : function(req,res){
        Schedule.aggregate(
            [
                {
                    $match: {
                        isActive : true,
                        type : 1    
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
    },
    getScheduleHistory : function(req,res){
        var scheduleId = req.params.scheduleId;

        History.find({scheduleId : scheduleId},function(err,result){
            res.json(result);    
        })

    },
    getScheduleDetails : function(req,res){
        var scheduleId = req.params.scheduleId;

        Schedule.findOne({_id : scheduleId,  isActive : true},function(err,result){
            res.json(result);
        })
    },
    downloadFile : function(req,res){
        const providerId = req.params.providerId;
        getProviderFTPDetails(providerId,function(ftpDetails){
            var c = new Client();
            c.connect({
                host: ftpDetails.ftpHost,
                port: 21,
                user: ftpDetails.ftpUsername,
                password: ftpDetails.ftpPassword
              });
              c.on('ready', function() {
                c.get(ftpDetails.directory, function(err, stream) {
                  if (err) {
                      console.error('FTP GET ERROR : ' + err);    
                  }
                  let filename =  extractFilename(ftpDetails.directory);
                  res.set('Content-disposition', 'attachment; filename=' +  filename);
                  res.set('Content-Type', 'text/plain');
                  stream.pipe(res);
                  //stream.pipe(fs.createWriteStream(__baseDir + '/inboundFiles/' + filename));
                  stream.once('close', function() {
                    c.end();
                  });
                    c.on('error', function(err) {
                            console.error("FTP Connect Error : ", err)
                        });
                    });
            });
        });
    }
};