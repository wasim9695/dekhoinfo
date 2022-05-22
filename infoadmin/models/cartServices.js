var con = require('../config/connectionServices');
var connection = con.connection;
// var async = require("async");

// var _respJson = [];
// var recordQueryStatus = function(mdata){
//   console.log(mdata);
//   _respJson.push(mdata);
// }
/*To Create New Cart*/
exports.createCart = function (req, res) {
    var Records = [];
    var UserId = req.body.userKey;
    if(req.body.OBcart != null){
      var count = 1;
      var myActualQuery;
      req.body.OBcart.forEach(function(data) {
          var myActualQuery = 'select count(0) As Result from tbl_cart where UserId = ? and ProductId = ? and IsOrdered = 0';
          connection.query(myActualQuery,[UserId, data.id], function (error, results, fields) {
            if (error){} 
            else{
              if(results[0].Result > 0){
                var myActualQuery = 'UPDATE tbl_cart SET Quantity = ? WHERE UserId = ? AND ProductId = ? AND Id > 0';
                connection.query(myActualQuery,[data.quantity , UserId, data.id] , function (error, results, fields) {
                  if (error){}
                  else{
                    //recordQueryStatus("Cart updated | ");
                  }
                });
              }else{
                Records = [];
                Records.push([UserId, data.id , data.quantity]);
                var myActualQuery = 'INSERT INTO tbl_cart(UserId , ProductId , Quantity) VALUES ?';
                connection.query(myActualQuery,[Records], function (error, results, fields) {
                  if (error){}
                  else{
                    //recordQueryStatus("Added to Cart | ");
                  }
                });
              }
            }
          });
          count++;
      });
    }
    res.json({
        status:true,
        message:'Cart updated sucessfully',
        data:[]
    })
}
// async function generateResponse(query , arrayObject) {
//   const [dbResult] = await [
//     connection.query(query, arrayObject)
//   ];
//   return dbResult;
// }
/*To Update New Cart*/
exports.updateCart = function (req, res) {
  var myActualQuery = 'UPDATE tbl_cart SET Quantity = ? WHERE UserId = ? AND ProductId = ? AND Id > 0';
  connection.query(myActualQuery,[req.body.OBcart[0].quantity , req.body.userKey, req.body.OBcart[0].id] , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Cart updated sucessfully',
          data:results
      })
    }
  });
  // var async = require("async");
  // var configs = {};
  // async.forEachOf(req.body.OBcart, (value, key, callback) => { 
  //   console.log(value); 
  //   //callback();
  // }, err => {
  //     if (err) console.error(err.message);
  //     // configs is now a map of JSON data
  //     //doSomethingWith(configs);
  //     console.log("done!")
  // });

  // const util = require('util');
  // // node native promisify
  // const query = util.promisify(connection.query).bind(connection);

  // var UserId = req.body.userKey;
  // if(req.body.OBcart != null){
  //   var count = 1;
  //   var myActualQuery;
  //   req.body.OBcart.forEach(function(data) {
  //     console.log(UserId , data.id)
  //     myActualQuery = 'select count(0) As Result from tbl_cart where UserId = ? and ProductId = ?';
  //     // await generateResponse(myActualQuery , [UserId, data.id]).then(queryResponse => {
  //     //   console.log(queryResponse);
  //     //   //res.json(queryResponse[0].Result);
  //     // })
  //     let myResult = (async (myQuery , dataArray) => {
  //       try {
  //         console.log([UserId, data.id]);
  //         const rows = await query(myQuery , dataArray);
  //         console.log("inside async", rows[0].Result);
  //         return rows;
  //       } finally {
  //         conn.end();
  //       }
  //     })(myActualQuery , [UserId, data.id]);

  //     console.log("outside sync",myResult);
  //   });
  // }
};

/*To Delete Cart*/
exports.deleteCart = function (req, res) {
  var myActualQuery = 'DELETE FROM tbl_cart WHERE UserId = ? AND ProductId = ?';
  connection.query(myActualQuery, [req.body.userKey , req.body.OBcart[0].id], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Cart deleted sucessfully',
          data:results
      })
    }
  });
};

/*To Delete Cart*/
exports.getCartDetail = function (req, res) {
  var myActualQuery = 'SELECT img.ImageName AS Thumb,p.IsTaxable,p.TaxPercentage, p.Id as ProductId , p.Name , P.Unit , p.Price, p.DiscountPrice,p.Quantity As AvailableProductQuantity, c.Quantity , c.RecordTime FROM tbl_cart c INNER JOIN tbl_product p ON c.ProductId = p.Id INNER JOIN tbl_productimages img ON c.ProductId = img.ProductId Where c.UserId = ? AND c.IsOrdered = 0 AND c.OrderId is null AND img.ImageType = "BannerImg";';
  connection.query(myActualQuery, req.body.UserId , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'data collected sucessfully',
          data:results
      })
    }
  });
};

/*To get Cart Details without login user*/
exports.getCartDetailWithoutLogin = function (req, res) {
  var myActualQuery = 'SELECT img.ImageName AS Thumb, cat.Id As CategoryId, cat.Name As CategoryName, p.IsTaxable,p.TaxPercentage,p.Id as ProductId,p.Weight, p.Name, P.Unit, p.Price, p.Quantity As AvailableProductQuantity, p.DiscountPrice FROM tbl_product p INNER JOIN tbl_productimages img ON p.Id = img.ProductId INNER JOIN tbl_category cat ON p.CategoryId = cat.Id Where img.ImageType = "bannerimg" AND p.Id IN ( ? )';
  var Records = [];
  if(req.body.OBcart != null){
    req.body.OBcart.forEach(function(data){
      Records.push([data.id]);
    });
  }
  connection.query(myActualQuery, [Records] , function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var CustomizeObject = {};
      results.forEach(function(data){
        CustomizeObject[data.ProductId] = data;
      })
      res.json({
          status:true,
          message:'data collected sucessfully',
          data:CustomizeObject
      })
    }
  });
};
