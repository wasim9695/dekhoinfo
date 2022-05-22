var express = require('express');
var router = express.Router();
var orderServices = require('../models/orderServices');

router.post("/placeOrder" , orderServices.placeOrder);
router.post("/getOrderHistory" , orderServices.getOrderHistory);
router.post("/changeOrderStatus" , orderServices.changeOrderStatus);
router.post("/getSingleOrderDetails" , orderServices.getSingleOrderDetails);
router.post("/getDateRangeOrders" , orderServices.getDateRangeOrders);
router.get("/getOrderDataInXls" , orderServices.getOrderDataInXls);


module.exports = router;
