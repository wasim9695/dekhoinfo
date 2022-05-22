var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var customerServices = require('../models/customerServices');

router.get("/createCustomer" , function(req , res){
  res.send("You have to make POST request to create a new customer");
});
router.post("/sendOTP" , customerServices.sendOTP);
router.post("/reSendOTP" , customerServices.reSendOTP);
router.post("/verifyOTP" , customerServices.verifyOTP);
router.post("/createCustomer" , customerServices.createCustomer);
router.post("/authenticateCustomer" , customerServices.authenticateCustomer);
router.post("/aproveCustomer" , customerServices.aproveCustomer);
router.post("/suspendCustomer" , customerServices.suspendCustomer);
router.post("/updateCustomer" , customerServices.updateCustomer);
router.post("/deleteCustomer" , customerServices.deleteCustomer);
router.post("/addCustomerAddress" , customerServices.addCustomerAddress);
router.post("/createPost" , customerServices.createPost);
router.post("/deleteCustomerAddress" , customerServices.deleteCustomerAddress);
router.post("/updateCustomerAddress" , customerServices.updateCustomerAddress);
router.get("/getCustomerAddressData/:UserId" , customerServices.getCustomerAddressData);
router.get("/getCustomerData/:UserId" , customerServices.getCustomerData);
router.post("/resetPassword" , customerServices.resetPassword);
router.get("/getCustomerDetailsInXls" , customerServices.getCustomerDetailsInXls);
router.post("/isCustomerExist" , customerServices.isCustomerExist);

module.exports = router;
