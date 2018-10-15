var mongoose = require('mongoose');
var schedule = require('node-schedule');
var cronJobs = {};
var async = require('async');
var Database = require("./../../../database");
var Schedule = Database.getcollectionSchema('schedule');
var Provider = Database.getcollectionSchema('provider');
var History = Database.getcollectionSchema('history');
var Vehicle = Database.getcollectionSchema('vehicle');

var path = require('path');
var Client = require('ftp');
var mongoose = require('mongoose');
var moment = require('moment');
var fs = require('fs');
var csv = require('fast-csv');

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
function updateLastNextRun(ftpDetails,added = 0){
    Schedule.findOne({_id : ftpDetails.jobId},function(err,result){
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
        obj['scheduleId'] = result._id;
        insertHistory(obj);
    })
}

function reScheduleJob(job,isStarted = false){
   // for re scheduling already scheduled  jobs which are vanished because server is restarted;
   
   // get local time with respect to utc time stored into db taken from client at time of scheduling

    var utcStartDate = moment.utc(moment(job.startDate).format('YYYY-MM-DD HH:mm:ss')).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule: job.expression }, function(job){
        if(!cronJobs[job._id]['isStarted']){
            cronJobs[job._id]['isStarted'] = true;
            updateIsStartedFlag(job._id);
        }
        executeCronJob(job);
    }.bind(null,job));
}
async function executeCronJob(job){
   if(job.providerId){
        let ftpDetails;
        try{
            ftpDetails = await getProviderFTPDetails(job.providerId);
                ftpDetails.jobId = job._id;
                // ftpDetails.myId = job.myId
                let readFile;
                try{
                    readFile =  await readFileFromServer(ftpDetails,job.OProviderId,job.id);
                }catch(msg){
                    console.log(msg);
                }
        }catch(err){
            console.log('Error While Getting Inbound Provider Info : ', err);
            
        }
   }else{
    uploadAllVehicles(job);
   }
}
function readFileFromServer(ftpDetails,OProviderId,id){
   return new Promise((success, error)=>{
    var c = new Client();
    var added = 0;

        c.connect({
            host: ftpDetails.ftpHost,
            port: 21,
            user: ftpDetails.ftpUsername,
            password: ftpDetails.ftpPassword
          });
          c.on('ready', function() {
           
            c.get(ftpDetails.directory, async function(err, stream) {
             
              if (err) {
                  console.log('File Download Error : ', err);
                  
              }
    
              stream.once('close', function() {c.end();});

              var filename =  new Date().getTime() + '.csv';   // temprary unqueue filename 
             /*  // extracting orignal filename from path
              var orginalFilename = ftpDetails.directory.replace(/^.*[\\\/]/, '');  */

              // localpath of file to be uploaded 
              var localPath = path.join(__baseDir , 'inboundFiles' ,filename);
              /*
               *  Adding new column (id) and its values into csv file  
               */
              var modifiedStream = await modifyFile(stream,id);
              /* Writing file into temprary folder */
              let fileResult
              try{
                  fileResult = fs.writeFileSync(localPath,modifiedStream);
                  /* Fetching Outbound provider's FTP Details  */
                  let providerDetails;
                  try{
                      providerDetails = await getProviderFTPDetails(OProviderId);
                      providerDetails.jobId = ftpDetails.jobId;   // 
                      
                      let uploadedFile;
                      try{
                      /* Uploading file which is downloaded */
                      uploadedFile = await uploadFile(providerDetails,localPath,filename);
                      }catch(err){
                         error('File Upload Error : ', err);
                      }finally{
                         
                      }
                  }catch(err){
                     error('Error While Get Outbound Provider Info :  ', err);
                  }
              }catch(err){
               error('Error FS Write CSV', err);
              }
            });
          });
          c.on('error', function(err) {
            error("err", err)
          });
   })
}

function modifyFile(stream,id){
    return new Promise((success,error)=>{
        var vehicle = [];
        csv
        .fromStream(stream,{
            headers: true,
            ignoreEmpty: true,
          })
        .on("data", function(data){
            data.id = id;
            vehicle.push(data);
        })
        .on("end", function(){
            csv.writeToString(vehicle,
                {headers: true},
                function(err, data){
                  success(data);
                }
            );
        });
    })
 
}

function uploadFile(ftpDetails,localPath,filename){
    return new Promise((success,error)=>{
        var c = new Client();
        c.connect({
            host: ftpDetails.ftpHost,
            port: 21,
            user: ftpDetails.ftpUsername,
            password: ftpDetails.ftpPassword
          });
          c.on('ready', function() {
            c.put(localPath, path.join(ftpDetails.directory,filename), function(err) {
                if (err){
                    error(err);
                }
                else{
                    updateLastNextRun(ftpDetails);
                    /*  Deleting Temprary stored file */
                    fs.unlink(localPath,(err) => {
                        if(!err)
                           success('File Deleted');
                        else
                          error('File Deleted Error : ',err);
                    })
                }
                c.end();
              });
          });
          c.on('error', function(err){
            console.log('Wrong Outbound FTP Details : ', err);
          })
    })

}
function insertHistory(obj){
    History.create(obj,function(err,result){
        
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

var getProviderFTPDetails = async function(providerId){
/*     return new Promise((success,error)=>{
        Provider.findOne({_id : providerId},function(err,result){
            if(err)
                error(err);
            else
                success(result);
        });
    }) */
    return await  Provider.findOne({_id : providerId});

}


function scheduleFutureJob(job){
    // scheduling new job for provider
    // get local time with respect to utc time stored into db taken from client at time of scheduling
   /*  var utcStartDate = moment.utc(job.startDate).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss'); */
    var utcStartDate = moment.utc(moment(job.startDate).format('YYYY-MM-DD HH:mm:ss')).toDate();
    var startDate = moment(utcStartDate).format('YYYY-MM-DD HH:mm:ss');

    cronJobs[job._id] = schedule.scheduleJob({ start: new Date(startDate).getTime(), rule:job.expression },async function(job){
        if(!cronJobs[job._id]['isStarted']){
            updateIsStartedFlag(job._id);
        }
        executeCronJob(job);
       
    }.bind(null,job));  
}

async function uploadAllVehicles(job){
    
    var filename =  new Date().getTime() + '.csv';   // temprary unqueue filename 
    // localpath of file to be uploaded 
    var localPath = path.join(__baseDir , 'inboundFiles' ,filename);
    /*
     *  Adding new column (id) and its values into csv file  
     */
    var vehicles = await Vehicle.find({},{_id : 0, providerId : 0, created : 0}).lean();

    vehicles.forEach((item,index) => {
        vehicles[index].id = job.id;
    });
    csv.writeToString(vehicles,
        {headers: true},
        async function(err, data){

            let fileResult = fs.writeFileSync(localPath,data);
            try{
                providerDetails = await getProviderFTPDetails(job.OProviderId);
                providerDetails.jobId = job._id;  

                let uploadedFile;
                try{
                /* Uploading file which is downloaded */
                uploadedFile = await uploadFile(providerDetails,localPath,'Testing_' + filename);
                }catch(err){
                   error('File Upload Error : ', err);
                }finally{

                }
            }catch(err){
               error('Error While Get Outbound Provider Info :  ', err);
            }
          
        }
    );
    /* Writing file into temprary folder */
    
}

/* function getHeaders(data){
    var headers = [];
    for(var key in data){
        headers.push(key);
    }
    return headers;
} */

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
       if(req.body.IProvider)
            scheduleObj['providerId'] = req.body.IProvider;


       scheduleObj['OProviderId'] = req.body.OProvider;
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
       scheduleObj['id'] = req.body.id;

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
    runCronJob : function(req,res){
        var scheduleId = req.params.scheduleId;
        Schedule.find({ _id : scheduleId, isActive: true, type : 1 },function(err,result){
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
                        "localField" : "OProviderId",
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

        Schedule.findOne({_id : scheduleId},function(err,result){
            res.json(result);
        })
    }
};