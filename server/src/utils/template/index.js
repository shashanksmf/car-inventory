const Json2csvParser = require('json2csv').Parser;
const path = require('path');
exports.get = function(req, res) {
  //
  //   var fields = [
  //       'name.firstName',
  //       'name.lastName',
  //       'biography',
  //       'twitter',
  //       'facebook',
  //       'linkedin'
  //   ];
  //
  //
  // const json2csvParser = new Json2csvParser({ fields });
  // const csv = json2csvParser.parse(myCars);
  //
  //   res.set("Content-Disposition", "attachment;filename=authors.csv");
  //   res.set("Content-Type", "application/octet-stream");
  //
  //   res.send(csv);
  res.sendFile(path.join(__dirname,'assets','template.csv'));

};
