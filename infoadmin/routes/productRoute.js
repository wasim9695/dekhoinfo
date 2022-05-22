var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var productServices = require('../models/productServices');

router.post("/createProduct" , productServices.createProduct);
router.post("/updateProduct" , productServices.updateProduct);
router.post("/deleteProduct" , productServices.deleteProduct);
router.post("/uploadProductImages" , productServices.uploadProductImages);
router.get("/getProductImages/:ProductId" , productServices.getProductImages);
router.post("/removeThumbImage" , productServices.removeThumbImage);
router.post("/changeProductSequence" , productServices.changeProductSequence);



module.exports = router;
