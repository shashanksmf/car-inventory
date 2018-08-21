var Provider = require('../../models/Inbound/provider');
var History = require('../../models/history');
var Client = require('ftp');
var c = new Client();
var csv = require('fast-csv');
const path = require('path');
var mongoose = require('mongoose');

module.exports = {
    getProvidersDetails : function(req,res){
      mongoose.model('provider').aggregate([{
        $match : { },

      },{
      $lookup: {
          "from": "cronschedules",
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
      History.find({$and: [{"lastRun" :{"$gte": date}},{"lastRun" :{"$lte": new Date()}}]},function(err,result){
          if(!err)
            res.json(result);
        });
    },
    getProviderHeaders : function(req,res){
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
          c.get(path.join(directoryPath, '/', req.body.filename), function(err, stream) {
            if (err){
              console.log("err ", err );
              return res.json({result : 0,msg : err, class : 'danger'});
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
              res.json(headers);
            });
      
            stream.pipe(csvStream);
          });
        });
        c.on('error',function(err){
          console.log("err",err)
          res.json({result : 0,msg : err, class : 'danger'});
        });
        c.connect({
              host: req.body.host,
              port: 21,
              user: req.body.uname,
              password: req.body.password
          });
    }      
}