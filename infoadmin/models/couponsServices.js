var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New Coupons*/
exports.createCoupons = function (req, res) {
    var myActualQuery = 'INSERT INTO  tbl_Coupons SET ?';
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
            message:'Coupons created sucessfully',
            data:results
        })
      }
    });
};
/*To Update New Coupons*/
exports.updateCoupons = function (req, res) {
      var myActualQuery = 'UPDATE  tbl_Coupons SET ? WHERE Id ='+req.body.Id;
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
              message:'Coupons updated sucessfully',
              data:results
          })
        }
      });
};
/*To Delete Coupons*/
exports.deleteCoupons = function (req, res) {
      var myActualQuery = 'UPDATE  tbl_Coupons SET IsActive = 0 WHERE Id ='+req.body.Id;
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
              message:'Coupons deleted sucessfully',
              data:results
          })
        }
      });    
};
function getDiscountPrice(mooldhan, discountPercent){
  return mooldhan - ((mooldhan * discountPercent) / 100) ;
}

exports.applyCouponCode = function (req, res) {
      var myActualQuery = 'SELECT Discount, DiscountUnit FROM tbl_coupons cs where cs.AssignedTo = '+ req.session.seller['sellerId'] +' AND cs.IsActive = 0 AND cs.CouponCode = "'+ req.body.CouponCode +'"; SELECT * from tbl_orderdetails where IsCouponApplied = 0 AND OrderId = '+ req.body.OrderId;
      connection.query(myActualQuery, function (error, results, fields) {
        if (error){
            res.json({
                status:false,
                message:'there are some error with query level 1',
                data : (!results)?error.sqlMessage:results
            })
        }else{
          if(results[0].length > 0 && results[1].length > 0){
            var discount = results[0][0].Discount;
            var priceUpdationQuery = "";
            var totalOrderPrice = 0;
            results[1].forEach(function(data){
              priceUpdationQuery += "UPDATE tbl_orderdetails set OfferPrice = "+ parseInt(getDiscountPrice(data.OfferPrice , discount)) +" , IsCouponApplied = 1 WHERE Id = " + data.Id+ ";";
              totalOrderPrice += parseInt(getDiscountPrice(data.OfferPrice , discount)) * data.Qty;
            });
            priceUpdationQuery += 'UPDATE tbl_order set OrderPrice = '+ totalOrderPrice +' WHERE Id = '+ req.body.OrderId;
            connection.query(priceUpdationQuery, function (error, results, fields) {
              if (error){
                  res.json({
                      status:false,
                      message:'there are some error with query level 2',
                      data : (!results)?error.sqlMessage:results
                  })
              }else{
                res.json({
                    status:true,
                    message:'Coupons applied sucessfully',
                    data:results
                })
              }
            });
          }else{
              res.json({
                  status:false,
                  message:'Coupons can be applied once',
                  data:results
              })
          }
        }
      });    
};


