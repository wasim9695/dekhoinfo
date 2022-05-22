var con = require('../config/connectionServices');
var connection = con.connection;
var getTimeStamp = function(){
  return new Date().getTime();
}
/*To Create New Category*/
exports.createBanner = function (req, res) {
  var globalProjectPath = req.app.locals.globarDir;
  let BannerImage = req.body.BannerImage;
  var BannerName = req.body.BannerName;
  var BannerLink = req.body.BannerLink;
  var LinkText = req.body.LinkText;
  var BannerDescription = req.body.BannerDescription;
  var ImageNameString = getTimeStamp();
  var Records = [];
  if(BannerImage != null && BannerImage.length > 0){
    Records.push(["BannerImage_"+ImageNameString+".png" , BannerName , BannerDescription , BannerLink,LinkText]);
    var base64Data = (BannerImage.indexOf(/^data:image\/png;base64,/) != -1) ? BannerImage.replace(/^data:image\/png;base64,/, "") : BannerImage.replace(/^data:image\/jpeg;base64,/, "");
    require("fs").writeFile(globalProjectPath + "/views/publicContent/cms/images/banner/BannerImage_"+ImageNameString+".png", base64Data, 'base64', function(err) {
      console.log("error uploading: "+err);
    });
    var myActualQuery = 'INSERT INTO tbl_banner(BannerImage, BannerName, BannerDescription, BannerLink , LinkText) VALUES ?';
    connection.query(myActualQuery,[Records], function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'Bannner created sucessfully',
            data:results
        })
      }
    });
  }
};

/*To Update New Category*/
exports.updateBanner = function (req, res) {
  var globalProjectPath = req.app.locals.globarDir;
  let BannerImage = req.body.BannerImage;
  var BannerName = req.body.BannerName;
  var BannerLink = req.body.BannerLink;
  var LinkText = req.body.LinkText;
  var BannerDescription = req.body.BannerDescription;
  var ImageNameString = getTimeStamp();
  if(BannerImage != null && BannerImage.length > 0){
    var base64Data = (BannerImage.indexOf(/^data:image\/png;base64,/) != -1) ? BannerImage.replace(/^data:image\/png;base64,/, "") : BannerImage.replace(/^data:image\/jpeg;base64,/, "");
    require("fs").writeFile(globalProjectPath + "/views/publicContent/cms/images/banner/BannerImage_"+ImageNameString+".png", base64Data, 'base64', function(err) {
      console.log("error uploading: "+err);
    });
    req.body.BannerImage = "BannerImage_"+ImageNameString+".png";
  }else{
    delete req.body.BannerImage;
  }
  var myActualQuery = 'UPDATE tbl_banner SET ? WHERE Id ='+req.body.Id;
  connection.query(myActualQuery, req.body , function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'Banner updated sucessfully',
            data:results
        })
      }
    });
};

/*To Delete Category*/
exports.activateDeActivateBanner = function (req, res) {
      var myActualQuery = 'UPDATE tbl_banner SET IsActive = ? WHERE Id ='+req.body.Id;
      connection.query(myActualQuery, req.body.IsActive ,function (error, results, fields) {
        if (error){
            res.json({
                status:false,
                message:'there are some error with query',
                data : (!results)?error.sqlMessage:results
            })
        }else{
          res.json({
              status:true,
              message:'Banner activated sucessfully',
              data:results
          })
        }
      });
};

/*To get banner images*/
exports.getBannerImages = function (req, res) {
      var myActualQuery = 'SELECT * FROM tbl_banner WHERE IsActive = 1';
      connection.query(myActualQuery, req.body.IsActive ,function (error, results, fields) {
        if (error){
            res.json({
                status:false,
                message:'there are some error with query',
                data : (!results)?error.sqlMessage:results
            })
        }else{
          res.json({
              status:true,
              message:'Banner collected sucessfully',
              data:results
          })
        }
      });
};
