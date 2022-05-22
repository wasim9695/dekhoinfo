var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var cartServices = require('../models/cartServices');

router.post("/createCart" , cartServices.createCart);
router.post("/updateCart" , cartServices.updateCart);
router.post("/deleteCart" , cartServices.deleteCart);
router.post("/getCartDetail" , cartServices.getCartDetail);
router.post("/getCartDetailWithoutLogin" , cartServices.getCartDetailWithoutLogin);

module.exports = router;
