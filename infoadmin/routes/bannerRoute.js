var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var bannerServices = require('../models/bannerServices');

router.post("/createBanner" , bannerServices.createBanner);
router.post("/updateBanner" , bannerServices.updateBanner);
router.post("/activateDeActivateBanner" , bannerServices.activateDeActivateBanner);
router.get("/getBannerImages" , bannerServices.getBannerImages);

module.exports = router;
