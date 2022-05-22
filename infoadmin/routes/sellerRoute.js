var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var sellerServices = require('../models/sellerServices');

router.get("/sellerRegistration", sellerServices.sellerRegistration);
router.post("/createSeller", sellerServices.createSeller);
router.post("/authenticateSeller", sellerServices.authenticateSeller);
router.post("/aproveSeller", sellerServices.aproveSeller);
router.post("/updateSeller", sellerServices.updateSeller);
router.post("/changeAccessStatus", sellerServices.changeAccessStatus);

module.exports = router;
