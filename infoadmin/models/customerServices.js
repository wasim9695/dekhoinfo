var con = require('../config/connectionServices');
var connection = con.connection;
var request = require('request');
// const SendOtp = require('sendotp');//old one 219640AyZnJky1M5b1b7b77
// const sendOtp = new SendOtp('244461Aj1v1EfawJz5bd16536', 'Otp for your order is {{otp}}, please do not share it with anybody');
const OTPServiceObject = {
  authkey : '253370AXw9nIY8Zg8d5c20e6bc',
  sendOTPUrl : 'http://sms.eincopsoft.com/api/otp.php',
  reSendOTPUrl : 'http://sms.eincopsoft.com/api/retryotp.php',
  verifyOTPUrl : 'http://sms.eincopsoft.com/api/verifyRequestOTP.php',
  message : 'Your OTP is '
};

function getOTPVal(length) {
    return Math.floor(1000 + Math.random() * 9000);
}

/*To register new customer/user*/
exports.createCustomer = function (req, res) {
    var myActualQuery = 'INSERT INTO tbl_customers SET ?';
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
            message:'user registered sucessfully',
            data:results
        })
      }
    });
};
exports.resetPassword = function (req, res) {
    var myActualQuery = 'UPDATE tbl_customers SET Password = ? WHERE Phone = ? AND Id > 0';
    connection.query(myActualQuery, [req.body.Password, req.body.Phone], function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'Password updated sucessfully',
            data:results
        })
      }
    });
};
exports.sendOTP = function (req, res) {
    // sendOtp.send("91"+ req.body.Phone, "ORGNIC", getOTPVal(), function (error, data, response) {
    //   if(data.type == 'success'){
    //     res.json({
    //       status:true,
    //       message:'OTP send successfully'
    //     })
    //   }
    //   if(data.type == 'error'){
    //     res.json({
    //       status:false,
    //       message:'OTP sending failed'
    //     })
    //   }
    // });
    var Phone = req.body.Phone;
    var OTPVal = getOTPVal();
    var URi = OTPServiceObject.sendOTPUrl+'?authkey='+OTPServiceObject.authkey+'&mobile='+Phone+'&message='+OTPServiceObject.message+' : '+ OTPVal +'&otp='+ OTPVal;
    request.get({ url: URi }, function(error, response, body) {
          if (!error && response.statusCode ==  200) {
            var jsondata = JSON.parse(body);
            if(jsondata.type == 'success'){
              res.json({
                status:true,
                message:'OTP send successfully'
              })
            }
            if(jsondata.type == 'error'){
              res.json({
                status:false,
                message:'OTP sending failed'
              })
            }              
          }
     });
};
exports.reSendOTP = function (req, res) {
  // sendOtp.retry("91"+ req.body.Phone, false, function (error, data, response) {
  //   if(data.type == 'success'){
  //     res.json({
  //       status:true,
  //       message:'OTP resend successfully'
  //     })
  //   }
  //   if(data.type == 'error'){
  //     res.json({
  //       status:false,
  //       message:'OTP resending failed'
  //     })
  //   }
  // });
  var Phone = req.body.Phone;
  var URi = OTPServiceObject.reSendOTPUrl+'?authkey='+OTPServiceObject.authkey+'&mobile='+Phone+'&retrytype=voice';
  request.get({ url: URi }, function(error, response, body) {
        if (!error && response.statusCode ==  200) {
          var jsondata = JSON.parse(body);
          if(jsondata.type == 'success'){
            res.json({
              status:true,
              message:'OTP send successfully'
            })
          }
          if(jsondata.type == 'error'){
            res.json({
              status:false,
              message:'OTP sending failed'
            })
          }              
        }
   });
};
exports.verifyOTP = function (req, res) {
  // sendOtp.verify("91"+ req.body.Phone, req.body.OTP, function (error, data, response) {
  //   if(data.type == 'success'){
  //     res.json({
  //       status:true,
  //       message:'OTP verified successfully'
  //     })
  //   }
  //   if(data.type == 'error'){
  //     res.json({
  //       status:false,
  //       message:'OTP verification failed'
  //     })
  //   }
  // });

  var Phone = req.body.Phone;
  var OTPVal = req.body.OTP;
  var URi = OTPServiceObject.verifyOTPUrl+'?authkey='+OTPServiceObject.authkey+'&mobile='+Phone+'&otp='+ OTPVal;
  request.get({ url: URi }, function(error, response, body) {
        if (!error && response.statusCode ==  200) {
          var jsondata = JSON.parse(body);
          if(jsondata.type == 'success'){
            res.json({
              status:true,
              message:'OTP send successfully'
            })
          }
          if(jsondata.type == 'error'){
            res.json({
              status:false,
              message:'OTP sending failed'
            })
          }              
        }
   });
};
/*To authenticate customer/user*/
exports.authenticateCustomer = function (req, res) {
  var email=req.body.Email;
  var phone=req.body.Phone;
  var password=req.body.Password;
  connection.query('SELECT * FROM tbl_customers WHERE email = ? OR phone = ?',[email , phone], function (error, results, fields) {
    if (error) {
        res.json({
          status:false,
          message:'there are some error with query'
          })
    }else{
      if(results.length >0){
          if(password==results[0].Password){
            var myActualQuery = 'SELECT img.ImageName AS Thumb,p.IsTaxable,p.TaxPercentage, p.Id as ProductId , p.Name , P.Unit , p.Price, p.DiscountPrice, c.Quantity , c.RecordTime FROM tbl_cart c INNER JOIN tbl_product p ON c.ProductId = p.Id INNER JOIN tbl_productimages img ON c.ProductId = img.ProductId Where c.UserId = ? AND c.IsOrdered = 0 AND c.OrderId is null AND img.ImageType = "BannerImg";';
            connection.query(myActualQuery, results[0].Id , function (error, cartresults, fields) {
              if (error){
                  res.json({
                    // status:false,(before text)
                      status:true,
                      message:'there are some error with retriving customer cart details',
                      data : (!results)?error.sqlMessage:results
                  })
              }else{
                res.json({
                    status:true,
                    message:'data collected sucessfully',
                    data:results,
                    cartData : cartresults
                })
              }
            });
          }else{
              res.json({
                status:false,
                message:"Email and password does not match"
               });
          }
      }
      else{
        res.json({
          status:false,
          message:"Email does not exits"
        });
      }
    }
  });
};

/*To update customer/user*/
exports.updateCustomer = function (req, res) {
    var myActualQuery = 'UPDATE tbl_customers SET ? WHERE Id ='+req.body.Id+';SELECT * FROM tbl_customers WHERE Id = '+req.body.Id;
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
            message:'user updated sucessfully',
            data:results[1]
        })
      }
    });
};
/*To delete customer/user*/
exports.deleteCustomer = function (req, res) {
    var myActualQuery = 'UPDATE tbl_customers SET IsActive = 0 WHERE Id ='+req.body.Id;
    connection.query(myActualQuery, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'user deleted sucessfully',
            data:results
        })
      }
    });
};

/*To aprove customer/user*/
exports.aproveCustomer = function (req, res) {
    var myActualQuery = 'UPDATE tbl_customers SET AprovalStatus = 1 WHERE Id ='+req.body.Id;
    connection.query(myActualQuery, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'customer aproved sucessfully',
            data:results
        })
      }
    });
};
/*To aprove customer/user*/
exports.suspendCustomer = function (req, res) {
    var myActualQuery = 'UPDATE tbl_customers SET AprovalStatus = 0 WHERE Id ='+req.body.Id;
    connection.query(myActualQuery, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'customer suspended sucessfully',
            data:results
        })
      }
    });
};

/*To update customer Profile*/
exports.addCustomerAddress = function (req, res) {
  var myActualQuery = 'INSERT INTO tbl_customeraddress SET ?';
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
          message:'Address added successfully',
          data:results
      })
    }
  });
};

/*To update customer Profile*/
exports.createPost = function (req, res) {
  var myActualQuery = 'INSERT INTO createpost SET ?';
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
          message:'added successfully',
          data:results
      })
    }
  });
};

/*To update customer Profile*/
exports.updateCustomerAddress = function (req, res) {
  var myActualQuery = 'UPDATE tbl_customeraddress SET ? WHERE Id = ?';
  connection.query(myActualQuery, [req.body, req.body.Id], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Address updated successfully',
          data:results
      })
    }
  });
};

/*To update customer Profile*/
exports.deleteCustomerAddress = function (req, res) {
  var myActualQuery = 'DELETE FROM tbl_customeraddress WHERE Id = ? and CustomerId = ?';
  connection.query(myActualQuery,[req.body.Id , req.body.CustomerId ], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'user address deleted sucessfully',
          data:results
      })
    }
  });
};

/*To get customer address*/
exports.getCustomerAddressData = function (req, res) {
  var myActualQuery = 'SELECT * FROM tbl_customeraddress WHERE CustomerId = ?';
  connection.query(myActualQuery, req.params.UserId , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'user address collected sucessfully',
          data:results
      })
    }
  });
};


/*To get customer data*/
exports.getCustomerData = function (req, res) {
  var myActualQuery = 'SELECT * FROM tbl_customers WHERE Id = ?';
  connection.query(myActualQuery, req.params.UserId , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'user address collected sucessfully',
          data:results
      })
    }
  });
};

/*To get customer data in excel formate*/
exports.getCustomerDetailsInXls = function (req, res) {
  var myActualQuery = 'SELECT distinct c.Id,c.Name,c.Email,c.Phone , ca.Address, ca.Pincode , c.RecordTime As RegistrationDate FROM tbl_customers c LEFT JOIN tbl_customeraddress ca ON c.Id = ca.CustomerId group by c.Phone order by c.Id asc;';
  connection.query(myActualQuery, function (error, results, fields) {
    if (error){
      res.xls('data.xlsx', results);
    }else{
      res.xls('data.xlsx', results);
    }
  });
};

exports.isCustomerExist = function (req, res) {
  var myActualQuery = 'SELECT Name, Phone FROM tbl_customers WHERE phone = ?';
  connection.query(myActualQuery, req.body.phone , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      if(results.length > 0){
        res.json({
            status:true,
            message:'1',
            data:results
        })
      }else{
        res.json({
            status:true,
            message:'0',
            data:results
        })
      }
    }
  });
};
