var con = require('../config/connectionServices');
var connection = con.connection;

/*To Create New Product*/
exports.sellerRegistration = function (req, res) {
  var SellerId = req.session.seller['sellerId'];
  if(req.session.registrationStep[5] && SellerId != undefined){
    res.render('sellerRegistration',{step : 5, SellerId : SellerId});
  }else if(req.session.registrationStep[4] && SellerId != undefined){
    var myActualQuery = 'select cat.Id, cat.Name from tbl_category cat where cat.IsActive = 1 order by cat.Id desc;';
    connection.query(myActualQuery, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        var JSONData= {};
        JSONData.Category = results;
        res.render('sellerRegistration',{step : 4 , SellerId : SellerId , cmsData : JSONData});
      }
    });
  }else if(req.session.registrationStep[3] && SellerId != undefined){
    res.render('sellerRegistration',{step : 3, SellerId : SellerId});
  }else if(req.session.registrationStep[2] && SellerId != undefined){
    res.render('sellerRegistration',{step : 2, SellerId : SellerId});
  }else{
    res.render('sellerRegistration',{step : 1, SellerId : 0});
  }
};
/*To Create New Seller*/
exports.createSeller = function (req, res) {
    var records = [];
    var myActualQuery = 'INSERT INTO tbl_seller SET ?';
    if(!req.session.registrationStep){
      myActualQuery = 'INSERT INTO tbl_seller SET ?';
    }else if(req.session.registrationStep[4] && req.session.seller['sellerId'] > 0){
      if(req.body.Categories != null){
        var sellerId = req.session.seller['sellerId'];
        if(req.body.Categories.constructor === Array){
          req.body.Categories.forEach(function(data){
            records.push([sellerId , data , req.body.SellingOtherWebsite , req.body.AnualIncome , req.body.GetProductFrom]);
          });
        }else{
            records.push([sellerId , req.body.Categories , req.body.SellingOtherWebsite , req.body.AnualIncome , req.body.GetProductFrom]);
        }        
      }
      myActualQuery = 'INSERT INTO tbl_sellerdetails (SellerId , CategoryId , SellingOtherWebsite , AnualIncome , GetProductFrom) VALUES ?';
    }else if(req.session.registrationStep[3] && req.session.seller['sellerId'] > 0){
      myActualQuery = 'UPDATE tbl_seller SET ? WHERE Id = '+ req.session.seller['sellerId'];
    }else if(req.session.registrationStep[2] && req.session.seller['sellerId'] > 0){
      myActualQuery = 'UPDATE tbl_seller SET ? WHERE Id = '+ req.session.seller['sellerId'];
    }
    connection.query(myActualQuery, (records.length > 0) ? [records] : req.body, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        if(req.session.registrationStep != undefined && req.session.registrationStep[2] == undefined){
          req.session.registrationStep[2] = true;
          req.session.seller['sellerId'] = results.insertId;
        }else if(req.session.registrationStep != undefined && req.session.registrationStep[2] && req.session.registrationStep[3] == undefined){
          req.session.registrationStep[3] = true;
          req.session.seller['sellerId'] = req.body.Id;
        }else if(req.session.registrationStep != undefined && req.session.registrationStep[3] && req.session.registrationStep[4] == undefined){
          req.session.registrationStep[4]=true;
          req.session.seller['sellerId'] = req.body.Id;
        }else if(req.session.registrationStep != undefined && req.session.registrationStep[4] && req.session.registrationStep[5] == undefined){
          req.session.registrationStep[5]=true;
          req.session.seller['sellerId'] = req.body.Id;
        }
        res.json({
            status:true,
            message:'Seller created sucessfully',
            data:results
        })
      }
    });
};
/*To authenticate customer/user*/
exports.authenticateSeller = function (req, res) {
  var email=req.body.Email;
  var password=req.body.Password;
  connection.query('SELECT * FROM tbl_seller WHERE Email = ?',[email], function (error, results, fields) {
    if (error) {
      console.log(error);
        res.json({
          status:false,
          message:'there are some error with query'
          })
    }else{
      if(results.length >0){
          if(password==results[0].Password){
              req.session.seller['sellerId'] = results[0].Id;
              req.session.seller['profile'] = results[0];
              res.json({
                  status:true,
                  message:'successfully authenticated',
                  data : results
              })
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
/*Update Seller*/
exports.updateSeller = function (req, res) {
    var records = [];
    var sellerId = req.body.Id;
    if(sellerId != req.session.seller['sellerId']){
      res.json({
          status:false,
          message:'you are not authorised to update this records',
          data : "you are not authorised to update this records"
      })
    }
    myActualQuery = 'UPDATE tbl_seller SET ? WHERE Id = '+ sellerId;
    if(req.body.Categories != null){
      req.body.Categories.forEach(function(data){
        records.push([data , req.body.SellingOtherWebsite , req.body.AnualIncome , req.body.GetProductFrom]);
      });
      myActualQuery = 'UPDATE tbl_sellerdetails SET ? WHERE Id = '+ sellerId;
    }
    connection.query(myActualQuery, (records.length > 0) ? [records] : req.body, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        res.json({
            status:true,
            message:'Seller updated sucessfully',
            data:results
        })
      }
    });
};

/*To Aprove Seller*/
exports.aproveSeller = function (req, res) {
    myActualQuery = 'UPDATE tbl_seller SET AprovalStatus = '+req.body.AprovalStatus+' WHERE Id = '+ req.body.sellerId;
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
            message:'Seller updated sucessfully',
            data:results
        })
      }
    });
};

/*To Aprove Seller*/
exports.changeAccessStatus = function (req, res) {
    myActualQuery = 'UPDATE tbl_seller SET AccessType = "'+req.body.AccessType+'" WHERE Id = '+ req.body.sellerId;
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
            message:'Seller updated sucessfully',
            data:results
        })
      }
    });
};
