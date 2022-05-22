var express = require('express');
var router = express.Router();
var apiServices = require('../models/apiServices');

router.get("/getSubCategory/:Id" , apiServices.getSubCategory);
router.get("/getCategory/:Id" , apiServices.getCategory);
router.get("/getAllCategories" , apiServices.getAllCategories);
router.get("/getAllProducts" , apiServices.getAllProducts);
router.get("/getCategoryProduct/:CategoryId" , apiServices.getCategoryProduct);
router.get("/getProduct/:Id" , apiServices.getProduct);
router.get("/getProductImages/:ProductId" , apiServices.getProductImages);
router.get("/getDeliverySlot/:Pincode" , apiServices.getDeliverySlot);
router.get("/search/:Terms" , apiServices.search);
router.get("/returnPromise" , apiServices.returnPromise);
router.get("/getAllPost" , apiServices.getAllPost);
router.get("/getAllPostID/:Id" , apiServices.getAllPostId);
router.post("/getGarphReportYearly" , apiServices.getGarphReportYearly);






module.exports = router;
