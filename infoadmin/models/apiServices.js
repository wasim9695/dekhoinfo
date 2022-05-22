var con = require('../config/connectionServices');
var connection = con.connection;

/*To get Sub Category By Their Id*/
exports.getSubCategory = function (req, res) {
  var myActualQuery = 'SELECT sa.* , c.Name AS Category FROM tbl_subcategory sa LEFT OUTER JOIN tbl_category c ON sa.CategoryId = c.Id WHERE sa.CategoryId = ? AND sa.IsActive = 1';
  connection.query(myActualQuery, req.params.Id, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'SubCategory',
          data:results
      })
    }
  });
};
/*To get All Category*/
exports.getAllCategories = function (req, res) {
  var myActualQuery = 'SELECT c.* FROM tbl_category c WHERE c.IsActive = 1';
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
          message:'All Category',
          data:results
      })
    }
  });
};
/*To get Category by Id*/
exports.getCategory = function (req, res) {
  var myActualQuery = 'SELECT c.* FROM tbl_category c WHERE c.Id = ? AND c.IsActive = 1';
  connection.query(myActualQuery, req.params.Id, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Category By Id',
          data:results
      })
    }
  });
};

/*To get All Products*/
exports.getAllProducts = function (req, res) {
  var myActualQuery = 'select distinct p.*, pi.ImageType, c.Name as Category ,sc.Name as SubCategory, pi.ImageName As Thumb , s.SellerName , s.StoreName , s.State As SellerLocation from tbl_product p inner join tbl_category c on c.id=p.CategoryId inner join tbl_subcategory sc on sc.id=p.SubCategoryId inner join tbl_seller s on p.SellerId = s.Id left join tbl_productimages pi on pi.ProductId = p.id where p.IsActive = 1 and c.IsActive = 1 and (s.AprovalStatus = 1 OR s.AccessType = "Admin") and pi.ImageType = "bannerImg" ORDER BY p.DisplayIndex ASC';
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
          message:'All products',
          data:results
      })
    }
  });
};



/*To get All Post*/
exports.getAllPost = function (req, res) {
  var myActualQuery = 'select * from createpost';
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
          message:'All Post',
          data:results
      })
    }
  });
};



/*To get All PostID*/
exports.getAllPostId = function (req, res) {
  var myActualQuery = 'select * from createpost where id ='+req.params.Id;
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
          message:'All Post',
          data:results
      })
    }
  });
};


/*To get Category Product by cat Id*/
exports.getCategoryProduct = function (req, res) {
  var myActualQuery = 'select distinct p.*, pi.ImageType, c.Name as Category ,sc.Name as SubCategory, pi.ImageName As Thumb , s.SellerName , s.StoreName , s.State As SellerLocation from tbl_product p inner join tbl_category c on c.id=p.CategoryId inner join tbl_subcategory sc on sc.id=p.SubCategoryId inner join tbl_seller s on p.SellerId = s.Id left join tbl_productimages pi on pi.ProductId = p.id where p.IsActive = 1  and (s.AprovalStatus = 1 OR s.AccessType = "Admin") and pi.ImageType = "bannerImg" and p.CategoryId = ?';
  connection.query(myActualQuery,req.params.CategoryId, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Product By Category Id',
          data:results
      })
    }
  });
};

/*To get Product by Id*/
exports.getProduct = function (req, res) {
  var myActualQuery = 'select distinct p.* , c.Name As Category, sc.Name As SubCategory, s.StoreName AS SellerName from tbl_product p LEFT OUTER JOIN tbl_category c ON p.CategoryId = c.Id LEFT OUTER JOIN tbl_subcategory sc ON p.SubCategoryId = sc.Id LEFT OUTER JOIN tbl_seller s ON p.SellerId = s.Id where p.Id = ? AND p.IsActive = 1';
  connection.query(myActualQuery,req.params.Id, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      res.json({
          status:true,
          message:'Product by Id',
          data:results
      })
    }
  });
};

/*To Delete Product*/
exports.getProductImages = function (req, res) {
  var myActualQuery = 'Select * from tbl_productimages WHERE ProductId ='+ req.params.ProductId;
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
          message:'Product collected sucessfully',
          data:results
      })
    }
  });
};

/*To get Delivery Slot*/
exports.getDeliverySlot = function (req, res) {
  var myActualQuery = 'SELECT dm.Id, dm.Pincode, dd.DayName, dts.SlotName, dts.TimeSlot FROM tbl_deliverymapping dm INNER JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id INNER JOIN tbl_deliverytimeslot dts ON dm.DeliverySlotId = dts.Id WHERE dm.IsActive = 1 AND dm.Pincode = '+ req.params.Pincode +' ORDER BY dm.Id DESC;SELECT dm.Id, dm.Pincode, dd.DayName, dts.SlotName, dts.TimeSlot FROM tbl_deliverymapping dm INNER JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id INNER JOIN tbl_deliverytimeslot dts ON dm.DeliverySlotId = dts.Id WHERE dm.IsActive = 1 ORDER BY dm.Id DESC';
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
          message:'Timeslot collected sucessfully',
          data:results[0],
          totalAvailablePincodeData:results[1]
      })
    }
  });
};

/*To get Delivery Slot*/
exports.search = function (req, res) {
  var myActualQuery = 'select distinct p.Id, p.Name,p.Unit, p.Price, p.CategoryId, p.Description, c.Name As Category, p.SubCategoryId, img.ImageName As Thumb from tbl_product p INNER JOIN tbl_category c ON p.CategoryId = c.Id LEFT OUTER JOIN tbl_productimages img ON p.Id = img.ProductId where p.Name LIKE "%'+req.params.Terms+'%" AND p.IsActive = 1 AND img.ImageType = "bannerImg";';
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
          message:'Records Found',
          data:results
      })
    }
  });
};


exports.returnPromise = function (req, res) {

  let promise = new Promise(function(resolve, reject) {
    setTimeout(() => resolve("done!"), 3500);
  });

  // resolve runs the first function in .then
  promise.then(
    (result) => res.json({
        status:true,
        message:'After 35 sec'
    }), // shows "done!" after 1 second
    (error) => res.json({
          status:false,
          message:'Before 35 sec'
     }) // doesn't run
  );   
    
};

/*To get Delivery Slot*/
exports.getGarphReportYearly = function (req, res) {
  var myActualQuery = 'select c.Id as CartId, c.ProductId , c.Quantity as OrderedQuantity, c.OrderId, od.Qty as DeliveredQuantity, od.OrderStatus, od.RecordTime from tbl_cart c inner join tbl_orderdetails od on c.OrderId = od.OrderId WHERE YEAR(od.RecordTime) = "'+req.body.year+'";';
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
          message:'Records Found',
          data:results
      })
    }
  });
};
