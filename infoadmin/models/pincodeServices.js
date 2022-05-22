var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New Pincode*/
exports.createPincode = function (req, res) {
  var records = [];
  if(req.body.DeliverySlotId != null){
    req.body.DeliveryDayId.forEach(function(daydata){
      req.body.DeliverySlotId.forEach(function(slotdata){
        records.push([req.body.Pincode , daydata, slotdata]);
      });
    });
  }
  var myActualQuery = 'INSERT INTO tbl_deliverymapping (Pincode , DeliveryDayId, DeliverySlotId) VALUES ?';
  connection.query(myActualQuery, [records], function (error, results, fields) {
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
/*To Update New Pincode*/
exports.updatePincode = function (req, res) {
  var myActualQuery = 'UPDATE tbl_deliverymapping SET DeliverySlotId = ? , DeliveryDayId = ? , Pincode = ? WHERE Id ='+req.body.Id;
  connection.query(myActualQuery, [req.body.DeliverySlotId, req.body.DeliveryDayId, req.body.Pincode], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Pincode updated sucessfully',
          data:results
      })
    }
  });
};
/*To Delete Pincode*/
exports.deletePincode = function (req, res) {
  var myActualQuery = 'UPDATE tbl_deliverymapping SET IsActive = 0 WHERE Id ='+req.body.Id;
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
          message:'Pincode deleted sucessfully',
          data:results
      })
    }
  });
};
