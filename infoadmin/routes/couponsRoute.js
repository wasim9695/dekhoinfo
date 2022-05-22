var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var couponsServices = require('../models/couponsServices');

router.post("/createCoupons" , couponsServices.createCoupons);
router.post("/updateCoupons" , couponsServices.updateCoupons);
router.post("/deleteCoupons" , couponsServices.deleteCoupons);
router.post("/applyCouponCode" , couponsServices.applyCouponCode);

module.exports = router;
