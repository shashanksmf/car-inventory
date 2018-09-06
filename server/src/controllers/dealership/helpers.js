var Database = require('./../../database');
var Dealership = Database.getcollectionSchema('dealership');
var Vehicle = Database.getcollectionSchema('vehicle');
var mongoose = require('mongoose');

module.exports = {
    addDealership : function(req,res){
        req.body._id = new mongoose.Types.ObjectId();
        Dealership.create(req.body,function(err,result){
            if(err)
                res.json({result : 0, msg : err});
            else
                res.json({result : 1, msg : 'New Dealership Added Successfully!'});
        });
    },
    search : function(req,res){
        var dealerName = '';
        var dealerAddress = '';
        var dealerCity = '';
        var sortBy = '';
        var sortOrder = '';
        var searchArry =  [];
        
        var limit = 12;
        var skip = 0;
        if(req.query.page && req.query.page > 1) skip = ((req.query.page * limit) - limit) - 1 ;

        // var dealerId = req.query.dealerId.trim();
        if(req.query.dealerName) dealerName = req.query.dealerName.trim();
        if(req.query.dealerAddress) dealerAddress = req.query.dealerAddress.trim();
        if(req.query.dealerCity) dealerCity = req.query.dealerCity.trim();
        if(req.query.sortBy) sortBy =  req.query.sortBy.trim();
        if(req.query.sortOrder) sortOrder = req.query.sortOrder;
        if(req.query.searchArry) searchArry = [];

       if(dealerName.length) searchArry.push({dealerName : { $regex: new RegExp(dealerName.toLowerCase(), "i") } });
       if(dealerAddress.length) searchArry.push({dealerAddress : { $regex: new RegExp( dealerAddress.toLowerCase(), "i") }});
       if(dealerCity.length) searchArry.push({dealerCity : { $regex: new RegExp(dealerCity.toLowerCase(), "i") } });
        if(!sortOrder) sortOrder = 1;
        var sortByObj = {};
        sortByObj[sortBy] = sortOrder;
       
        Vehicle.find({ 
            "$and" : searchArry
        }).sort(sortByObj).skip(skip).limit(limit).exec(function(err,result){
            if(err)
                res.json({result : 0, total : 0});
            else{
               Vehicle.find({ 
                    "$and" : searchArry
                }).count().exec(function(err,total){
                    res.json({result : 1, data : result, total : total});
                });

                
            }
        });
    }
};