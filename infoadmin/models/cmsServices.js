var con = require('../config/connectionServices');
var connection = con.connection;

var getQueryList = function(queryArray){
  var queryString = string.empty;
  return queryString;
}

exports.renderCMS = function(req , res){
  var myActualQuery='select cat.Id, cat.Name from tbl_category cat where cat.IsActive = 1; select * from tbl_seller order by Id desc limit 10; select distinct p.* , img.ImageName, img.ImageType from tbl_product p INNER JOIN tbl_productimages img ON p.Id = img.ProductId where p.IsActive = 1 order by p.Id desc limit 10;select * from tbl_customers order by Id desc limit 10;select  o.Id, o.OrderPrice,  o.OrderStatus, o.PaymentMethod,  o.RecordTime  As OrderOn,  c.Name,  ca.Address As ShipingAddress,  ca.Name as ShipingName,  ca.Mobile as ShipingPhone,  ca.AlternateMobile as ShipingAlternatePhone,  ca.Address as ShipingAddress,  ca.Locality as ShipingLocality,  ca.City as ShipingCity,  ca.State as ShipingState,  ca.Landmark as ShipingLandmark,  ca.Pincode as ShipingPincode from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id ORDER BY o.Id DESC;select * from tbl_subcategory order by Id desc limit 10';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
      if (error){
          res.json({
              status:false,
              message:'there are some error with query',
              data : (!results)?error.sqlMessage:results
          })
      }else{
        var JSONData= {};
        JSONData.Category = results[0];
        JSONData.Seller = results[1];
        JSONData.Product = results[2];
        JSONData.Customer = results[3];
        JSONData.Order = results[4];
        JSONData.SubCategory = results[5];
        JSONData.Profile = req.session.seller['profile'];
        res.render("dashboard" , {cmsData : JSONData});
      }
  });
}
exports.renderCategory = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results;
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsCategory" , {cmsData : JSONData});
    }
  });
}
exports.renderCoupons = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select * from tbl_coupons Where IsActive = 1;Select s.Id, s.SellerName from tbl_seller s where AccessType = "Manager" AND IsActive = 1';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Coupons = results[1];
      JSONData.Seller = results[2];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsCoupons" , {cmsData : JSONData});
    }
  });
}
exports.renderSubCategory = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select * from tbl_subcategory cat where cat.IsActive = 1';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.SubCategory = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsSubCategory" , {cmsData : JSONData});
    }
  });
}
exports.renderCategoryDetails = function(req , res){
  res.locals.catId = req.params.catId;
  var catId = req.params.catId;
  var IncludeSeller = "";
  IncludeSeller = (req.session.seller['profile'].AccessType == 'Admin') ? '' : ' and p.SellerId =' + req.session.seller['profile'].Id;
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select s.* from tbl_sellerdetails sd LEFT OUTER JOIN tbl_seller s  ON sd.SellerId = s.Id  where sd.CategoryId = ? GROUP BY sd.SellerId;select distinct p.* , img.ImageName, img.ImageType, s.SellerName , s.StoreName , s.AprovalStatus from tbl_product p INNER JOIN tbl_seller s ON p.SellerId = s.Id LEFT JOIN tbl_productimages img ON p.Id = img.ProductId where CategoryId = ? and p.IsActive = 1 and img.ImageType = "bannerImg" '+ IncludeSeller +' ORDER BY p.DisplayIndex ASC;select * from tbl_customers; select  o.Id, o.OrderPrice,  o.OrderStatus, o.PaymentMethod,  o.RecordTime  As OrderOn,  c.Name,  ca.Address As ShipingAddress,  ca.Name as ShipingName,  ca.Mobile as ShipingPhone,  ca.AlternateMobile as ShipingAlternatePhone,  ca.Address as ShipingAddress,  ca.Locality as ShipingLocality,  ca.City as ShipingCity,  ca.State as ShipingState,  ca.Landmark as ShipingLandmark,  ca.Pincode as ShipingPincode from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id LEFT OUTER join tbl_orderdetails od ON o.Id = od.OrderId Where od.CategoryId = ? ORDER BY o.Id;select * from tbl_subcategory where CategoryId = ?;';
  connection.query(myActualQuery,[catId,catId,catId,catId], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Seller = results[1];
      JSONData.Product = results[2];
      JSONData.Customer = results[3];
      JSONData.Order = results[4];
      JSONData.SubCategory = results[5];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsCategoryDetails" , {cmsData : JSONData});
      //res.json(JSONData);
    }
  });
}
exports.renderProduct = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select * from tbl_product prd where prd.IsActive = 1';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Product = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsProduct" ,{productData : JSONData});
    }
  });
}
exports.renderProductSequence = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select distinct p.* , img.ImageName, img.ImageType from tbl_product p LEFT JOIN tbl_productimages img ON p.Id = img.ProductId where p.IsActive = 1 and img.ImageType = "bannerImg" ORDER BY p.DisplayIndex ASC';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Product = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsProductSequence" ,{cmsData : JSONData});
    }
  });
}
exports.renderSeller = function(req , res){
  // res.locals.catId = req.params.catId;
  // var catId = req.params.catId;
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1; select s.* from tbl_seller s Where s.IsActive = 1';
  connection.query(myActualQuery,req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Seller = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsSeller" , {sellerData : JSONData});
      //res.json(JSONData);
    }
  });
}
exports.renderCustomer = function(req , res){
  // res.locals.catId = req.params.catId;
  // var catId = req.params.catId;
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;SELECT distinct c.* , ca.Address, ca.Pincode, (select count(*) from tbl_order o where o.CustomerId = c.Id) As TotalOrders FROM tbl_customers c LEFT JOIN tbl_customeraddress ca ON c.Id = ca.CustomerId group by c.Phone order by c.Id desc;';
  connection.query(myActualQuery,req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Customer = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsCustomer" , {customerData : JSONData});
      //res.json(JSONData);
    }
  });
}
exports.renderOrder = function(req , res){
  var uxData = req.session.seller['profile'];
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select  o.Id, o.OrderPrice,  o.OrderStatus, o.PaymentMethod,  o.RecordTime  As OrderOn,  c.Name,  ca.Address As ShipingAddress,  ca.Name as ShipingName,  ca.Mobile as ShipingPhone,  ca.AlternateMobile as ShipingAlternatePhone,  ca.Address as ShipingAddress,  ca.Locality as ShipingLocality,  ca.City as ShipingCity,  ca.State as ShipingState,  ca.Landmark as ShipingLandmark,  ca.Pincode as ShipingPincode, ds.SlotName, ds.TimeSlot, dd.DayName from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id LEFT JOIN tbl_deliverymapping dm ON o.DeliverySlotId = dm.Id LEFT JOIN tbl_deliverytimeslot ds ON dm.DeliverySlotId = ds.Id LEFT JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id ORDER BY o.Id DESC;SELECT * FROM  tbl_coupons cs where cs.AssignedTo = '+ uxData.Id +' AND cs.IsActive = 0;';
  if(uxData.AccessType == 'Manager'){
    myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select  o.Id, o.OrderPrice,  o.OrderStatus, o.PaymentMethod,  o.RecordTime  As OrderOn,  c.Name,  ca.Address As ShipingAddress,  ca.Name as ShipingName,  ca.Mobile as ShipingPhone,  ca.AlternateMobile as ShipingAlternatePhone,  ca.Address as ShipingAddress,  ca.Locality as ShipingLocality,  ca.City as ShipingCity,  ca.State as ShipingState,  ca.Landmark as ShipingLandmark,  ca.Pincode as ShipingPincode, ds.SlotName, ds.TimeSlot, dd.DayName from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id LEFT JOIN tbl_deliverymapping dm ON o.DeliverySlotId = dm.Id LEFT JOIN tbl_deliverytimeslot ds ON dm.DeliverySlotId = ds.Id LEFT JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id WHERE c.Email = "'+ uxData.Email +'" ORDER BY o.Id DESC;SELECT * FROM  tbl_coupons cs where cs.AssignedTo = '+ uxData.Id +' AND cs.IsActive = 0;';
  }
  connection.query(myActualQuery,req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Order = results[1];
      JSONData.Coupons = results[2];
      JSONData.Profile = req.session.seller['profile'];
      console.log(JSONData);
      res.render("cmsOrder" , {orderData : JSONData});
    }
  });
}
exports.renderDeliverySlot = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;SELECT * FROM tbl_deliverytimeslot WHERE IsActive = 1 ORDER BY Id DESC;SELECT * FROM tbl_deliveryday WHERE IsActive = 1; SELECT dm.* , dd.DayName, dts.SlotName, dts.TimeSlot  FROM tbl_deliverymapping dm INNER JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id INNER JOIN tbl_deliverytimeslot dts ON dm.DeliverySlotId = dts.Id WHERE dm.IsActive = 1 ORDER BY dm.Id DESC';
  connection.query(myActualQuery,req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.DeliverySlot = results[1];
      JSONData.DeliveryDay = results[2];
      JSONData.Pincode = results[3];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsDeliverySlot" , {slotData : JSONData});
    }
  });
}
exports.renderProfile = function(req, res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;SELECT * FROM tbl_Seller s WHERE s.IsActive = 1 AND s.Id = ?';
  connection.query(myActualQuery,[req.session.seller['sellerId']], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Profile = results[1][0];
      req.session.seller['profile'] = results[1][0];
      res.render('sellerProfile' , {profileData : JSONData});
    }
  });
}
exports.renderProfileDetails = function(req, res){
  var profileId = req.params.profileId;
  if(profileId == req.session.seller['sellerId']){res.redirect('/cms/profile')}
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;SELECT * FROM tbl_Seller s WHERE s.IsActive = 1 AND s.Id = ?';
  connection.query(myActualQuery,[profileId], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Profile = req.session.seller['profile']
      JSONData.SellerProfile = results[1][0];
      res.render('sellerProfileDetails' , {profileData : JSONData});
    }
  });
}
exports.renderInvoice = function(req, res){
  var orderId = req.params.orderId;
  var myActualQuery = 'SELECT o.Id, o.OrderToken, o.RecordTime As OrderOn,  o.OrderStatus, od.OfferPrice, s.SellerName As SellerName,  c.Name As CustomerName,c.Email As Email, c.Phone as Phone,  CONCAT(s.Address1, " ", s.Address2) As StoreAddress,  p.Name As ProductName,  p.Price, p.Weight, p.WeightUnit, od.Qty FROM tbl_order o LEFT OUTER JOIN tbl_orderdetails od ON o.Id = od.OrderId LEFT OUTER JOIN tbl_seller s ON s.Id = od.SellerId LEFT OUTER JOIN tbl_customers c ON c.Id = od.CustomerId LEFT OUTER JOIN tbl_product p ON p.Id = od.ProductId  WHERE od.OrderStatus = "delivered" and o.Id='+ orderId +' ORDER BY o.Id DESC';
  connection.query(myActualQuery,[orderId], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Invoice = results;
      res.render('cmsInvoice' , {cmsData : JSONData});
    }
  });
}
exports.renderInvoicePrint = function(req, res){
  var orderId = req.params.orderId;
  var myActualQuery = 'SELECT o.Id, o.OrderToken, o.RecordTime As OrderOn,  o.OrderStatus, od.OfferPrice,  s.SellerName As SellerName,  c.Name As CustomerName, c.Email As Email, c.Phone as Phone, CONCAT(s.Address1, " ", s.Address2) As StoreAddress,  p.Name As ProductName,  p.Price, p.Weight, p.WeightUnit, od.Qty FROM tbl_order o LEFT OUTER JOIN tbl_orderdetails od ON o.Id = od.OrderId LEFT OUTER JOIN tbl_seller s ON s.Id = od.SellerId LEFT OUTER JOIN tbl_customers c ON c.Id = od.CustomerId LEFT OUTER JOIN tbl_product p ON p.Id = od.ProductId  WHERE od.OrderStatus = "delivered" and o.Id='+ orderId +' ORDER BY o.Id DESC';
  connection.query(myActualQuery,[orderId], function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Invoice = results;
      res.render('cmsInvoicePrint' , {cmsData : JSONData});
    }
  });
}

exports.renderSignout = function(req, res){
  req.session.destroy();
  res.redirect('/cms/login');
}
exports.renderLogin = function(req, res){
  res.render('sellerLogin');
}

exports.renderBanner = function(req , res){
  var myActualQuery = 'select * from tbl_category cat where cat.IsActive = 1;select * from tbl_banner';
  connection.query(myActualQuery, req.body, function (error, results, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query',
            data : (!results)?error.sqlMessage:results
        })
    }else{
      var JSONData= {};
      JSONData.Category = results[0];
      JSONData.Banner = results[1];
      JSONData.Profile = req.session.seller['profile'];
      res.render("cmsBanner" , {cmsData : JSONData});
    }
  });
}
// exports.renderImage = function(req , res){
//   var imagename = req.params.img;
//   var globalProjectPath = req.app.locals.globarDir;
//   console.log(imagename);
//   console.log(globalProjectPath+'/views/publicContent/cms/images/products/'+imagename);
//   res.sendFile(globalProjectPath+'/views/publicContent/cms/images/products/'+imagename);
// }


