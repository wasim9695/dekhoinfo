var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var deliverySlotServices = require('../models/deliverySlotServices');

router.post("/createDeliverySlot" , deliverySlotServices.createDeliverySlot);
router.post("/updateDeliverySlot" , deliverySlotServices.updateDeliverySlot);
router.post("/deleteDeliverySlot" , deliverySlotServices.deleteDeliverySlot);

module.exports = router;
