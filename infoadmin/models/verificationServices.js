var con = require('../config/connectionServices');
var connection = con.connection;
/*To send OTP to the new customer/user*/
exports.sendOTP = function (req, res) {
  connection.connect(function(error) {
    if (error){
      res.json({
          status:false,
          message:'there are some error with connecting to database'
      })
    }else{
      /*Generating randome OTP*/
      var newOTP = Math.floor(1000 + Math.random() * 9000);
      var myActualQuery = 'INSERT INTO  tbl_customers SET VarificationCode = ? WHERE Id = ?';
      connection.query(myActualQuery, [newOTP , req.body.Id], function (error, results, fields) {
        if (error){
            res.json({
                status:false,
                message:'there are some error with query',
                data : (!results)?error.sqlMessage:results
            })
        }else{
          /*SEND OTP to the use here by msg - logic to send OTP*/
          res.json({
              status:true,
              message:'user registered sucessfully',
              data:results
          })
        }
      });
    }
  });
};
/*To authenticate customer/user*/
exports.verifyOTP = function (req, res) {
  var Id=req.body.Id;
  var OTPValue=req.body.OTP;
  connection.query('SELECT COUNT(1) FROM  tbl_customers WHERE Id = ? AND VarificationCode = ?',[Id , OTPValue], function (error, results, fields) {
    if (error) {
        res.json({
          status:false,
          message:'there are some error with query'
          })
    }else{
      if(results.length >0){
        res.json({
            status:true,
            message:'successfully Verified',
            data : results
        })
      }
      else{
        res.json({
          status:false,
          message:"OTP Does not match"
        });
      }
    }
  });
};
