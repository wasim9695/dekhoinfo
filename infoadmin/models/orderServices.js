var con = require('../config/connectionServices');
var connection = con.connection;
function getOrderToken(){
  var d = new Date();
  function pad(n){return n<10 ?'0'+n : n}
  var dateStr = d.getUTCFullYear()+''+ pad(d.getUTCMonth()+1)+''+ pad(d.getUTCDate())+''+ pad(d.getUTCHours())+''+ pad(d.getUTCMinutes())+''+ pad(d.getUTCSeconds())+''+d.getUTCMilliseconds();
  return dateStr;
}
function getSubtotal(price, quantity){
  return Number(price * quantity);
}
function getTotalTax(price, quantity, tax){
  return Number(((price * tax) / 100) * quantity);
}

exports.placeOrder = function (req, res) {
  let promise = new Promise(function(resolve, reject) {
    var myActualQuery = 'SELECT p.Id as ProductId ,p.Quantity As Stock,p.Weight, p.CategoryId, p.SellerId, p.Name , P.Unit , p.Price,p.TaxPercentage, p.DiscountPrice, c.Quantity , c.RecordTime FROM tbl_cart c INNER JOIN tbl_product p ON c.ProductId = p.Id WHERE c.UserId = ? AND c.IsOrdered = 0 AND c.OrderId is null;';
    connection.query(myActualQuery, req.body.UserKey , function (error, cartResults, fields) {
      // console.log("helo");
      if (error){
          reject({
              status:false,
              message:'there are some error with query level 0',
              data : (!cartResults)?error.sqlMessage:cartResults
          })
      }else{
        var totalTransactionValue = 0;
        var quantityUpdationQuery = "";
        var subtotal = 0;
        var totalTax = 0;
        var price = 0;
        var tax = 0;
        cartResults.forEach(function(data){

          price = Number((data.DiscountPrice > 0)?data.DiscountPrice:data.Price);
          tax = Number(data.TaxPercentage);
          subtotal += getSubtotal(price , data.Quantity);
          totalTax += getTotalTax(price , data.Quantity, tax);
          quantityUpdationQuery += "UPDATE tbl_product set Quantity = "+ parseInt(data.Stock - (data.Weight * data.Quantity)) +" WHERE Id = " + data.ProductId+ ";";

        });
        subtotal = Math.round(subtotal);
        totalTax = Math.round(totalTax);
        totalTransactionValue = subtotal + totalTax;
        if(totalTransactionValue == req.body.Price){
          var orderRecord = [];
          var OrderToken = getOrderToken();
          orderRecord.push([req.body.UserKey , req.body.AddressId , req.body.SlotId, OrderToken , totalTransactionValue , req.body.PaymentMethod]);
          var myActualQuery = 'INSERT INTO tbl_order (CustomerId , AddressId , DeliverySlotId, orderToken , OrderPrice , PaymentMethod ) values ?';
          connection.query(myActualQuery, [orderRecord] , function (error, results, fields) {
            if (error){
                reject({
                    status:false,
                    message:'there are some error with query level 1',
                    data : (!results)?error.sqlMessage:results
                })
            }else{
              var OrderId = results.insertId;
              var cartRecords = [];
              var ItemPrice = 0;
              cartResults.forEach(function(data){
                ItemPrice = parseInt(Math.round((data.DiscountPrice > 0)?data.DiscountPrice:data.Price));
                cartRecords.push([OrderId , req.body.UserKey , data.SellerId ,data.CategoryId , data.ProductId , data.Quantity, ItemPrice ]);
              });
              var myActualQuery = 'INSERT INTO tbl_orderdetails (OrderId , CustomerId , SellerId , CategoryId , ProductId , Qty, OfferPrice ) values ?';
              connection.query(myActualQuery, [cartRecords] , function (error, results, fields) {
                if (error){
                    reject({
                        status:false,
                        message:'there are some error with query level 2',
                        data : (!cartResults)?error.sqlMessage:cartResults
                    })
                }else{
                  ///delete entry from cart here
                  var myActualQuery = 'UPDATE tbl_cart SET IsOrdered = 1 , OrderId ='+OrderId+' WHERE UserId = '+req.body.UserKey+' AND IsOrdered = 0 AND OrderId is null AND Id > 0;';
                  myActualQuery += quantityUpdationQuery;
                  connection.query(myActualQuery, [cartRecords] , function (error, results, fields) {
                    if (error){
                        reject({
                            status:false,
                            message:'there are some error with query level 3',
                            data : (!cartResults)?error.sqlMessage:cartResults
                        })
                    }else{
                      if(req.body.PaymentMethod == "COD"){
                        resolve({
                            status:true,
                            message:'Order Placed Successfully',
                            data : [{"OrderId" : OrderId}]
                        });
                      }else if(req.body.PaymentMethod == "Prepaid"){
                        // resolve({
                        //     status:true,
                        //     message:'Redirect to payment gateway',
                        //     OrderToken : OrderToken,
                        //     UserId : req.body.UserKey
                        // })
                      }
                    }
                  });
                }
              });
            }
          });
        }else{
          reject({
              status:false,
              message:'Provided price mismatch',
              data : totalTransactionValue
          })
        }
      }
    });
  });

  // resolve runs the first function in .then
  promise.then(
    (result) => res.json(result), // return when order placed successfully
    (error) => res.json(error) // return when error occured
  );

};

exports.getSingleOrderDetails = function (req, res) {
  var myActualQuery = 'SELECT o.Id, od.Id as ProductOrderId, o.OrderToken, o.RecordTime As OrderOn,  o.OrderStatus, p.Name As ProductName,  p.Price, od.Qty, p.WeightUnit, od.OfferPrice, od.OrderStatus AS ProductOrderStatus FROM tbl_order o LEFT OUTER JOIN tbl_orderdetails od ON o.Id = od.OrderId  LEFT OUTER JOIN tbl_product p ON p.Id = od.ProductId  WHERE o.Id= ? ORDER BY o.Id DESC';
  connection.query(myActualQuery,[req.body.OrderId] ,function (error, cartResults, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query level 0',
            data : (!cartResults)?error.sqlMessage:cartResults
        })
    }else{
        res.json({
            status:true,
            message:'Order Collected Successfully',
            data : (!cartResults)?error.sqlMessage:cartResults
        })
    }
  });
};

exports.getDateRangeOrders = function (req, res) {
  var myActualQuery = 'select  o.Id, o.OrderPrice,  o.OrderStatus, o.PaymentMethod,  o.RecordTime  As OrderOn,  c.Name,  ca.Address As ShipingAddress,  ca.Name as ShipingName,  ca.Mobile as ShipingPhone,  ca.AlternateMobile as ShipingAlternatePhone,  ca.Address as ShipingAddress,  ca.Locality as ShipingLocality,  ca.City as ShipingCity,  ca.State as ShipingState,  ca.Landmark as ShipingLandmark,  ca.Pincode as ShipingPincode, ds.SlotName, ds.TimeSlot, dd.DayName from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id LEFT JOIN tbl_deliverymapping dm ON o.DeliverySlotId = dm.Id LEFT JOIN tbl_deliverytimeslot ds ON dm.DeliverySlotId = ds.Id LEFT JOIN tbl_deliveryday dd ON dm.DeliveryDayId = dd.Id WHERE o.RecordTime between "'+req.body.StartDate+'" and "'+req.body.EndDate+'" ORDER BY o.Id DESC';
  connection.query(myActualQuery,[req.body.OrderId] ,function (error, cartResults, fields) {
    if (error){
        res.render()
    }else{
        var catData = {};
        catData.Order = cartResults;
        res.render("orderAjax" , {catData : catData});
    }
  });
};

exports.changeOrderStatus = function (req, res) {
  var myActualQuery = 'UPDATE tbl_order SET OrderStatus = ? WHERE Id = '+ req.body.Id+';';
  req.body.ProductsStatus.forEach(function(data,index){
    myActualQuery += 'UPDATE tbl_orderdetails SET OrderStatus = "'+data.OrderStatus+'" , Qty = '+data.Quantity+' WHERE Id ='+data.Id+';';
  });
  connection.query(myActualQuery,req.body.Status,function (error, cartResults, fields) {
    if (error){
        res.json({
            status:false,
            message:'there are some error with query level 0',
            data : (!cartResults)?error.sqlMessage:cartResults
        })
    }else{
        res.json({
            status:true,
            message:'Order Updated Successfully',
            data : (!cartResults)?error.sqlMessage:cartResults[0]
        })
    }
  });
};


/*To get customer data in excel formate*/
exports.getOrderDataInXls = function (req, res) {
  var myActualQuery = 'select  o.Id, o.RecordTime  As OrderOn, c.Name,  ca.Address As ShipingAddress, o.OrderPrice,  ca.State, p.Name As Product, od.Qty from tbl_order o INNER join tbl_customers c on o.CustomerId = c.Id LEFT OUTER join tbl_customeraddress ca on o.AddressId = ca.Id LEFT JOIN tbl_orderdetails od ON o.Id = od.OrderId LEFT JOIN tbl_product p ON od.ProductId = p.Id ORDER BY o.Id DESC;';
  connection.query(myActualQuery, function (error, results, fields) {
    if (error){
      res.xls('data.xlsx', results);
    }else{
      res.xls('data.xlsx', results);
    }
  });
};

exports.getOrderHistory = function (req, res) {
  console.log("hello");
  var myActualQuery = 'select   o.Id,  o.OrderPrice, od.OrderStatus AS ProductDeliveryStatus, o.OrderStatus,  o.PaymentMethod,   o.RecordTime  As OrderOn, c.Id As CustomerId,   c.Name,   ca.Address As ShipingAddress,   ca.Name as ShipingName,   ca.Mobile as ShipingPhone,   ca.AlternateMobile as ShipingAlternatePhone,   ca.Address as ShipingAddress,   ca.Locality as ShipingLocality,   ca.City as ShipingCity,   ca.State as ShipingState,   ca.Landmark as ShipingLandmark,   ca.Pincode as ShipingPincode , s.Id as SellerId , s.SellerName, s.StoreName, p.Name As ProductName,p.IsTaxable,p.TaxPercentage, p.Id As ProductId, p.Unit As ProductUnit, p.Price As ProductPrice, p.DiscountPrice, crt.Quantity, cat.Name As CategoryName, pi.ImageName As Thumb from tbl_orderdetails od  join tbl_order o on od.OrderId = o.Id  join tbl_customeraddress ca on o.AddressId = ca.Id  join tbl_customers c on od.CustomerId = c.Id  join tbl_seller s on od.SellerId = s.Id join tbl_Product p on od.ProductId = p.Id join tbl_cart crt on od.ProductId = crt.ProductId join tbl_category cat ON p.CategoryId = cat.Id join tbl_productimages pi ON pi.ProductId = p.Id WHERE c.Id = ? AND crt.OrderId = od.OrderId AND crt.IsOrdered = 1 AND pi.ImageType = "bannerImg" ORDER BY o.Id ASC;';
  connection.query(myActualQuery, req.body.UserKey , function (error, cartResults, fields) {
    // console.log("helo");
    if (error){
        res.json({
            status:false,
            message:'there are some error with query level 0',
            data : (!cartResults)?error.sqlMessage:cartResults
        })
    }else{
        var responseJson = getSerializeOrderObject(cartResults);
        res.json({
            status:true,
            message:'Order collected',
            data : (!cartResults)?error.sqlMessage:responseJson
        })
    }
  });
};

var getSerializeOrderObject = function(jsondata){
    var orderArray = {};
    jsondata.forEach(function(item, index){
      if(!orderArray[item.Id]){
        var orderOtherDetails = {};
        orderOtherDetails.Id = item.Id;
        orderOtherDetails.OrderPrice = item.OrderPrice;
        orderOtherDetails.OrderStatus = item.OrderStatus;
        orderOtherDetails.PaymentMethod = item.PaymentMethod;
        orderOtherDetails.OrderOn = item.OrderOn;
        orderOtherDetails.CustomerId = item.CustomerId;
        orderOtherDetails.Name = item.Name;
        orderOtherDetails.ShipingAddress = item.ShipingAddress;
        orderOtherDetails.ShipingName = item.ShipingName;
        orderOtherDetails.ShipingPhone = item.ShipingPhone;
        orderOtherDetails.ShipingAlternatePhone = item.ShipingAlternatePhone;
        orderOtherDetails.ShipingLocality = item.ShipingLocality;
        orderOtherDetails.ShipingCity = item.ShipingCity;
        orderOtherDetails.ShipingState = item.ShipingState;
        orderOtherDetails.ShipingLandmark = item.ShipingLandmark;
        orderOtherDetails.ShipingPincode = item.ShipingPincode;
        orderOtherDetails.SellerId = item.SellerId;
        orderOtherDetails.SellerName = item.SellerName;
        orderOtherDetails.StoreName = item.StoreName;


        var products = {};
        products.OrderId = item.Id;
        products.ProductName = item.ProductName;
        products.ProductId = item.ProductId;
        products.ProductUnit = item.ProductUnit;
        products.ProductPrice = item.ProductPrice;
        products.DiscountPrice = item.DiscountPrice;
        products.Quantity = item.Quantity;
        products.CategoryName = item.CategoryName;
        products.IsTaxable = item.IsTaxable;
        products.TaxPercentage = item.TaxPercentage;
        products.ProductDeliveryStatus = item.ProductDeliveryStatus;
        products.Thumb = item.Thumb;

        orderOtherDetails.Products = [];
        orderOtherDetails.Products.push(products);
        orderArray[item.Id] = orderOtherDetails;
      }else{
        var products = {};
        products.OrderId = item.Id;
        products.ProductName = item.ProductName;
        products.ProductId = item.ProductId;
        products.ProductUnit = item.ProductUnit;
        products.ProductPrice = item.ProductPrice;
        products.DiscountPrice = item.DiscountPrice;
        products.Quantity = item.Quantity;
        products.CategoryName = item.CategoryName;
        products.IsTaxable = item.IsTaxable;
        products.TaxPercentage = item.TaxPercentage;
        products.ProductDeliveryStatus = item.ProductDeliveryStatus;
        products.Thumb = item.Thumb;
        orderArray[item.Id]['Products'].push(products);
      }

    });
    jsondata = orderArray;
    return jsondata;
}
