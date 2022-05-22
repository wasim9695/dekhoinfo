var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var con = require('../config/connectionServices');
var connection = con.connection;

/*
Live Credentials
==================
Merchant Key
gRWufdEs

Merchant Salt
B3ncmzQK0H

Auth Header
A3SGcFmKCqi2RzoRofyiRD8Bb2SsH/QzujIvu+WJ4GE=

Test Credentials
==================
Test Key
gRWufdEs

Test Salt
B3ncmzQK0H

Test Auth Header
A3SGcFmKCqi2RzoRofyiRD8Bb2SsH/QzujIvu+WJ4GE=


Test card details
==================

Card Type: Visa

Card Name: Test

Card Number: 4012001037141112

Expiry Date : 05/20

CVV : 123

Card Type: Master

Card Name: Test

Card Number: 5123456789012346

Expiry Date : 05/20

CVV : 123

*/
var merchantKeys = {};
merchantKeys.MerchantKey = "gRWufdEs";
merchantKeys.MerchantSalt = "B3ncmzQK0H";
merchantKeys.AuthHeader = "A3SGcFmKCqi2RzoRofyiRD8Bb2SsH/QzujIvu+WJ4GE";

var testKeys = {};
testKeys.MerchantKey = "gRWufdEs";
testKeys.MerchantSalt = "B3ncmzQK0H";
testKeys.AuthHeader = "A3SGcFmKCqi2RzoRofyiRD8Bb2SsH/QzujIvu+WJ4GE";

var getHashValue = function (data){
	//var data = JSON.parse(data);
	var cryp = crypto.createHash('sha512');
	var text = data.key+'|'+data.txnid+'|'+data.amount+'|'+data.pinfo+'|'+data.fname+'|'+data.email+'|||||'+data.udf5+'||||||'+data.salt;
	cryp.update(text);
	var hash = cryp.digest('hex');		
	// res.setHeader("Content-Type", "text/json");
 //    res.setHeader("Access-Control-Allow-Origin", "*");
    return JSON.stringify(hash);		
}

function getOrderToken(){
  var d = new Date();
  function pad(n){return n<10 ?'0'+n : n}
  var dateStr = d.getUTCFullYear()+''+ pad(d.getUTCMonth()+1)+''+ pad(d.getUTCDate())+''+ pad(d.getUTCHours())+''+ pad(d.getUTCMinutes())+''+ pad(d.getUTCSeconds())+''+d.getUTCMilliseconds();
  return dateStr;
}

router.post("/payumoneyPayment", function(req, res) {
	console.log("called");

  let promise = new Promise(function(resolve, reject) {
  	console.log("-------------------");
  	console.log(req.body.UserKey);
    var myActualQuery = 'SELECT p.Id as ProductId ,p.CategoryId, p.SellerId, p.Name , P.Unit , p.Price, c.Quantity , c.RecordTime FROM tbl_cart c, tbl_product p Where c.ProductId = p.Id AND c.UserId = ? AND c.IsOrdered = 0';
    connection.query(myActualQuery, req.body.UserKey , function (error, cartResults, fields) {
      if (error){
      	console.log(error);
          reject({
              status:false,
              message:'there are some error with query level 0',
              data : (!cartResults)?error.sqlMessage:cartResults
          })
      }else{
        console.log("cartResult:" , cartResults);
        var totalTransactionValue = 0;
        cartResults.forEach(function(data){
          totalTransactionValue += parseInt(data.Price * data.Quantity);
        });
        if(totalTransactionValue == req.body.Price){
          var productList = [];
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
              cartResults.forEach(function(data){	
              	productList.push([OrderId]);
                cartRecords.push([OrderId , req.body.UserKey , data.SellerId ,data.CategoryId , data.ProductId , data.Quantity]);
              });
              var myActualQuery = 'INSERT INTO tbl_orderdetails (OrderId , CustomerId , SellerId , CategoryId , ProductId , Qty ) values ?';
              connection.query(myActualQuery, [cartRecords] , function (error, results, fields) {
                if (error){
                    reject({
                        status:false,
                        message:'there are some error with query level 2',
                        data : (!cartResults)?error.sqlMessage:cartResults
                    })
                }else{
                  ///delete entry from cart here
                  var myActualQuery = 'UPDATE tbl_cart SET IsOrdered = 1 , OrderId ='+OrderId+' WHERE UserId = '+req.body.UserKey+' AND IsOrdered = 0 AND OrderId is null AND Id > 0;SELECT * FROM tbl_customers WHERE Id ='+ req.body.UserKey;
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
                      	console.log("prepaid block" , results[1][0]);
                      	var data = {};
                      	data.key=testKeys.MerchantKey;//$('#key').val(),
						data.salt=testKeys.MerchantSalt; //$('#txnid').val(), 
						data.txnid=OrderToken; //$('#amount').val(),
						data.amount=totalTransactionValue; //$('#amount').val(),
						data.firstname=results[1][0].Name; //$('#fname').val(),
						data.email=results[1][0].Email; //$('#email').val(),
						data.phone=results[1][0].Phone; //$('#mobile').val(),
						data.pinfo=productList.toString(); //$('#pinfo').val(),
						data.udf5="BOLT_KIT_NODE_JS"; ///$('#udf5').val(),
						data.surl ="http://localhost:9229/payumoneyPaymentResponse"; //$('#surl').val(),
						data.furl="http://localhost:9229/payumoneyPaymentResponse"; //$('#surl').val()
						data.hash=getHashValue(data);//$('#hash').val(),
						console.log("resolving data : ", data);
                        resolve(data);
                      }
                    }
                  });
                }
              });
            }
          });
        }else{
        	console.log("error in order");
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
    (result) => res.render("payumoneyPayment" , {data : result}), // return when order placed successfully
    (error) => res.json(error) // return when error occured
  );   
  
});

router.post("/payumoneyPaymentResponse" , function (req,res) {
	var key = req.body.key;
	var salt = req.body.salt;
	var txnid = req.body.txnid;
	var amount = req.body.amount;
	var productinfo = req.body.productinfo;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var udf5 = req.body.udf5;
	var mihpayid = req.body.mihpayid;
	var status = req.body.status;
	var resphash = req.body.hash;
	
	var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
	var keyArray 		= 	keyString.split('|');
	var reverseKeyArray	= 	keyArray.reverse();
	var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	
	var cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
	var calchash = cryp.digest('hex');
	
	var msg = 'Payment failed for Hash not verified...';
	if(calchash == resphash)
		msg = 'Transaction Successful and Hash Verified...';
	
	res.render("payumoneyPaymentResponse", {key: key,salt: salt,txnid: txnid,amount: amount, productinfo: productinfo, 
	firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg});
})

module.exports = router;
