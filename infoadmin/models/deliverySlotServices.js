var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New Cart*/
exports.createDeliverySlot = function (req, res) {
  var myActualQuery = 'INSERT INTO tbl_deliverytimeslot SET ?';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Product created sucessfully',
          data:results
      })
    }
  });
};
/*To Update New Cart*/
exports.updateDeliverySlot = function (req, res) {
  var myActualQuery = 'UPDATE tbl_deliverytimeslot SET ? WHERE Id ='+req.body.Id;
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Slot updated sucessfully',
          data:results
      })
    }
  });
};
/*To Delete Slot*/
exports.deleteDeliverySlot = function (req, res) {
  var myActualQuery = 'UPDATE tbl_deliverytimeslot SET IsActive = 0 WHERE Id ='+req.body.Id;
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Slot deleted sucessfully',
          data:results
      })
    }
  });
};
