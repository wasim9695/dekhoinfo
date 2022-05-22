var con = require('../config/connectionServices');
var connection = con.connection;
var imgur = require('imgur-node-api');
imgur.setClientID('9ba00a2e24a5df1');


/*To Create New Product*/
exports.createProduct = function (req, res) {
    var myActualQuery = 'INSERT INTO  tbl_product SET ?';
    connection.query(myActualQuery, req.body, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageType) VALUES (? , ?)';
        connection.query(myActualQuery, [results.insertId , 'bannerImg'], function (error, imgResult, fields) {
          if (error){
              res.json({
                  status:false,
                  message:'there are some error with image query query',
                  data : (!imgResult)?error.sqlMessage:imgResult
              })
          }else{
            res.json({
                status:true,
                message:'Product image created sucessfully',
                data:results
            })
          }
        })
      }
    });
};
/*To Update New Product*/
exports.updateProduct = function (req, res) {
    var myActualQuery = 'UPDATE  tbl_product SET ? WHERE Id ='+req.body.Id;
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
            message:'Product updated sucessfully',
            data:results
        })
      }
  });
};
/*To Delete Product*/
exports.deleteProduct = function (req, res) {
    var myActualQuery = 'UPDATE  tbl_product SET IsActive = 0 WHERE Id ='+req.body.Id;
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
            message:'Product deleted sucessfully',
            data:results
        })
      }
  });
};
/*To Delete Product*/
exports.removeThumbImage = function (req, res) {
    var myActualQuery = '';
    if(req.body.ImageType != 'bannerImg'){
      myActualQuery = 'DELETE FROM tbl_productimages WHERE ImageType=\''+ req.body.ImageType +'\' AND ProductId = '+ req.body.ProductId +' AND Id > 0';
    }else{
      myActualQuery = 'UPDATE tbl_productimages SET ImageName =\'NULL\' WHERE ImageType=\''+ req.body.ImageType +'\' AND ProductId = '+ req.body.ProductId +' AND Id > 0';
    }
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
            message:'Product image removed sucessfully',
            data:results
        })
      }
  });
};

/*To Delete Product*/
exports.changeProductSequence = function (req, res) {
    var myActualQuery = '';
    if(req.body.SequenceArray.length > 0){
      req.body.SequenceArray.forEach(function(data,index){
        if(index > 0){
          myActualQuery += ";";
        }
        myActualQuery += "update tbl_product set DisplayIndex ="+data.sequenceId+" where Id ="+ data.productId;
      });
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
              message:'Product sequence changed sucessfully',
              data:results
          })
        }
      });
    }else{
      res.json({
          status:false,
          message:'data input is not provided',
          data : null
      })
    }
};


/*To Upload product Images*/
exports.uploadProductImages = function (req, res) {
    let bannerImg = req.body.bannerImg;
    let ThumbImg1 = req.body.ThumbImg1;
    let ThumbImg2 = req.body.ThumbImg2;
    let ThumbImg3 = req.body.ThumbImg3;
    let ThumbImg4 = req.body.ThumbImg4;
    let ThumbImg5 = req.body.ThumbImg5;
    var globalProjectPath = req.app.locals.globarDir;
    var ProductId = req.body.ProductId;
    if(bannerImg != null && bannerImg.length > 0){
      var Records = [];
      var deleteString = "";

      var base64Data = bannerImg.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/bannerImg_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records.push([ProductId , res.data.link , 'bannerImg']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'bannerImg' and Id > 0;"
          //console.log(res.data.link);
          var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
          myActualQuery = deleteString + myActualQuery;
          connection.query(myActualQuery, [Records], function (error, results, fields) {
          });
        });
      });
    }
    if(ThumbImg1 != null && ThumbImg1.length > 0){
      var Records1 = [];
      var deleteString = "";

      var base64Data = ThumbImg1.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/ThumbImg1_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records1.push([ProductId , res.data.link , 'ThumbImg1']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'ThumbImg1'  and Id > 0;"
            //console.log(res.data.link);
            var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
            myActualQuery = deleteString + myActualQuery;
            connection.query(myActualQuery, [Records1], function (error, results, fields) {
          });
        });
      });
    }
    if(ThumbImg2 != null && ThumbImg2.length > 0){
      var Records2 = [];
      var deleteString = "";

      var base64Data = ThumbImg2.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/ThumbImg2_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records2.push([ProductId , res.data.link , 'ThumbImg2']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'ThumbImg2'  and Id > 0;"
            //console.log(res.data.link);
            var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
            myActualQuery = deleteString + myActualQuery;
            connection.query(myActualQuery, [Records2], function (error, results, fields) {
          });
        });
      });
    }
    if(ThumbImg3 != null && ThumbImg3.length > 0){
      var Records3 = [];
      var deleteString = "";

      var base64Data = ThumbImg3.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/ThumbImg3_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records3.push([ProductId , res.data.link , 'ThumbImg3']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'ThumbImg3' and Id > 0;"
            //console.log(res.data.link);
            var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
            myActualQuery = deleteString + myActualQuery;
            connection.query(myActualQuery, [Records3], function (error, results, fields) {
          });
        });
      });
    }
    if(ThumbImg4 != null && ThumbImg4.length > 0){
      var Records4 = [];
      var deleteString = "";

      var base64Data = ThumbImg4.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/ThumbImg4_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records4.push([ProductId , res.data.link , 'ThumbImg4']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'ThumbImg4' and Id > 0;"
            //console.log(res.data.link);
            var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
            myActualQuery = deleteString + myActualQuery;
            connection.query(myActualQuery, [Records4], function (error, results, fields) {
          });
        });
      });
    }
    if(ThumbImg5 != null && ThumbImg5.length > 0){
      var Records5 = [];
      var deleteString = "";

      var base64Data = ThumbImg5.replace(/^data:image\/png;base64,/, "");
      var imagePath = globalProjectPath + "/views/publicContent/cms/images/Products/ThumbImg5_"+ProductId+".png";
      require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
        console.log("error uploading: "+err);
        imgur.upload(imagePath, function (err,res) {
          Records5.push([ProductId , res.data.link , 'ThumbImg5']);
          deleteString = "delete from tbl_productimages where ProductId = "+ProductId+" and ImageType = 'ThumbImg5' and Id > 0;"
            //console.log(res.data.link);
            var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
            myActualQuery = deleteString + myActualQuery;
            connection.query(myActualQuery, [Records5], function (error, results, fields) {
          });
        });
      });
    }
    // var myDeleteQuery = 'DELETE FROM table WHERE (ProductId , ImageName, ImageType) IN ?';
    // var myActualQuery = 'INSERT INTO tbl_productimages(ProductId , ImageName, ImageType) VALUES ?';
    // myActualQuery = deleteString + myActualQuery;
    // connection.query(myActualQuery, [Records], function (error, results, fields) {
    //     if (error){
    //         res.json({
    //             status:false,
    //             message:'there are some error with query',
    //             data : (!results)?error.sqlMessage:results
    //         })
    //     }else{
    //       res.json({
    //           status:true,
    //           message:'Product image uploaded sucessfully',
    //           data:results
    //       })
    //     }
    // });
    res.json({
        status:true,
        message:'Product image uploaded sucessfully',
        data:null
    })
};

exports.getProductImages = function (req, res) {
    var myActualQuery = 'SELECT * FROM tbl_productimages WHERE ProductId = ?';
    connection.query(myActualQuery, req.params.ProductId, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
          res.json({
              status:true,
              message:'Product image collected sucessfully',
              data:results
          })
      }
    });
};
