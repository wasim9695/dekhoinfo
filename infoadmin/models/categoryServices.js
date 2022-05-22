var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New Category*/
exports.createCategory = function (req, res) {
    var myActualQuery = 'INSERT INTO  tbl_category SET ?';
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
            message:'Category created sucessfully',
            data:results
        })
      }
    });
};
/*To Update New Category*/
exports.updateCategory = function (req, res) {
      var myActualQuery = 'UPDATE  tbl_category SET ? WHERE Id ='+req.body.Id;
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
              message:'Category updated sucessfully',
              data:results
          })
        }
      });
};
/*To Delete Category*/
exports.deleteCategory = function (req, res) {
      var myActualQuery = 'UPDATE  tbl_category SET IsActive = 0 WHERE Id ='+req.body.Id;
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
              message:'Category deleted sucessfully',
              data:results
          })
        }
      });    
};
