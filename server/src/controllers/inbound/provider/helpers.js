var Database = require("./../../../database");
var Provider = Database.getcollectionSchema('provider');
var History = Database.getcollectionSchema('history');

var Client = require('ftp');

var csv = require('fast-csv');
const path = require('path');
var mongoose = require('mongoose');
var moment = require('moment');

module.exports = {
    getProvidersDetails : function(req,res){
     Provider.aggregate([{
        $match : {
          providerType : 1
         },

      },{
      $lookup: {
          "from": "schedule",
          "localField": "_id",
          "foreignField": "providerId",
          "as": "providersData"
      }
    },
    ], function(err, result){
      res.json(result);
    });
    },
    getOrignalHeaders :  function(req, res) {
        res.json(headers);
    },
    addProvider :  function(req, res) {
        var providerObj = {};
        for (var param in req.body) {
          if (param != 'headers')
            providerObj[param] = req.body[param];
        }
        var headersMapped = {};
        for (var header in req.body.headers) {
          headersMapped[header] = req.body.headers[header];
        }
        providerObj['_id'] = new mongoose.Types.ObjectId();
        providerObj['providerType'] = 1;
        providerObj.headersMapped = headersMapped;
        Provider.create(providerObj, function(err, result) {
          if(!err)
            res.json({result : true, msg : 'New Provider Added Successfully!', class : 'success'});
          else
            res.json({result : false, msg : 'Error While Adding Provider!', class : 'danger'});
        });
      },
    getTodaysProvidersData : function(req,res){
      var date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      History.find({type : 1,$and: [{"lastRun" :{"$gte": moment.utc(date).format('YYYY-MM-DD HH:mm:ss') }},{"lastRun" :{"$lte": moment.utc().format('YYYY-MM-DD HH:mm:ss')}}]},function(err,result){
          if(!err)
            res.json(result);
        });
    },

    
    getProviderHeaders : function(req,res){
      var c = new Client();
        var directoryPath = req.body.dict ? req.body.dict : '';
        var headers = [];
        var d;
        // console.log('Dicrectoy ; ' , directoryPath + '/' + req.body.filename);
        var taskObj = {};
        var vehicleList = [];
        taskObj['_id'] = new mongoose.Types.ObjectId();
        taskObj['startTime'] = Date.now();
        var isFirstLine = true;
        c.on('ready', function() {
          c.get(path.join(directoryPath), function(err, stream) {
            if (err){
              console.log("err ", err );
              return  res.json({result : 0 ,msg : 'File Or Directory Not Found!', class : 'danger'});
            }
            stream.once('close', function() { c.end(); });
            // stream.pipe(fs.createWriteStream('inboundFiles/' + req.body.filename));
      
            var csvStream = csv()
            .on("data", function(data){
              if (isFirstLine) {
                for (var i = 0; i < data.length; i++) {
                  data[i] = data[i].trim()
                }
                isFirstLine = false;
                headers = data;
                // console.log("headers ", headers );
              }
            })
            .on("end", function(){
              res.json({result : 1, headers : headers});
            });
      
            stream.pipe(csvStream);
          });
        });
        c.on('error',function(err){
          console.log("err",err)
          res.json({result : 0,msg : 'FTP Connection Failed!', class : 'danger'});
        });
        c.connect({
              host: req.body.host,
              port: 21,
              user: req.body.uname,
              password: req.body.password
          });
    }      
}