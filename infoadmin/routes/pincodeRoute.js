var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var pincodeServices = require('../models/pincodeServices');

router.post("/createPincode" , pincodeServices.createPincode);
router.post("/updatePincode" , pincodeServices.updatePincode);
router.post("/deletePincode" , pincodeServices.deletePincode);

module.exports = router;
