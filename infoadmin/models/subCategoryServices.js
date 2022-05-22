var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New SubCategory*/
exports.createSubCategory = function (req, res) {
    var myActualQuery = 'INSERT INTO tbl_subcategory SET ?';
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
            message:'SubCategory created sucessfully',
            data:results
        })
      }
    });
};
/*To Update New SubCategory*/
exports.updateSubCategory = function (req, res) {
    var myActualQuery = 'UPDATE tbl_subcategory SET ? WHERE Id ='+req.body.Id;
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
            message:'SubCategory updated sucessfully',
            data:results
        })
      }
    });
};
/*To Delete SubCategory*/
exports.deleteSubCategory = function (req, res) {
    var myActualQuery = 'UPDATE tbl_subcategory SET IsActive = 0 WHERE Id ='+req.body.Id;
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
            message:'SubCategory deleted sucessfully',
            data:results
        })
      }
    });
};
