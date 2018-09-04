
var Client = require('ftp');
var fs = require('fs');
var c = new Client();

module.exports = {
    getDirectoryFiles : function(req,res){
      var c = new Client();
      // console.log('Query', req.query);
      if(req.query.dir == 'parent directory')
        req.query.dir = '..';
      c.on('ready', function() {
        c.list(req.query.dir,function(err, list) {
          if (err) {
            res.json({
              result: 0,
              msg: err,
              class: 'danger'
            });
          }
          else{
            list.splice(0, 0, { name : 'parent directory',type : 'd'});
            res.json({
              result: 1,
              msg: 'Connection Successfully Established !',
              class: 'success',
              list: list
            });

            
          }
         
          c.end();
         
        });
      });

      c.on('error', function(err) {
        // console.log("err", err)
        res.json({
          result: 0,
          msg: 'FTP Connection Failed!',
          class: 'danger'
        });
      });
      c.connect({
                host: req.query.host,
                port: 21,
                user: req.query.uname,
                password: req.query.password
              });
    },
    testFTP :  function(req, res) {
        var c = new Client(); 
      
        c.on('ready', function() {
          c.list(function(err, list) {
            if (err) {
              res.json({
                result: 0,
                msg: err,
                class: 'danger'
              });
            }
           
            // console.log('Files ', list);
            
            c.end();
            list.splice(0,0,{type : 'd', name : './'});
            res.json({
              result: 1,
              msg: 'Connection Successfully Established !',
              class: 'success',
              list: list
            });
          });
      
      
        });
        c.on('error', function(err) {
            // console.log("err", err, 'Body ' , req.body)
            res.json({
              result: 0,
              msg: 'FTP Connection Failed!',
              class: 'danger'
            });
          });
          c.connect({
            host: req.body.host,
            port: 21,
            user: req.body.uname,
            password: req.body.password
          });
    },
    uploadFile : function(req, res) {
        c.on('ready', function() {
          c.put('./inboundFiles/docs.zip', '/uploaded/docs.zip', function(err) {
            if (err) throw err;
            c.end();
            res.send('Uploaded');
          });
        });
        c.connect({
          host: '127.0.0.1',
          port: 21,
          user: 'Ajayssj',
          password: 'ajayajay'
        });
    },
    downloadFile : function(req, res) {
        c.on('ready', function() {
          c.get('small-inventory.csv', function(err, stream) {
            if (err) throw err;
            stream.once('close', function() {
              c.end();
            });
            stream.pipe(fs.createWriteStream(
              'inboundFiles/small-inventory.csv'));
            res.send('Fine');
          });
        });
        c.connect({
          host: '127.0.0.1',
          port: 21,
          user: 'Ajayssj',
          password: 'ajayajay'
        });
    }
}