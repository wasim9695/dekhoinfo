var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var categoryServices = require('../models/categoryServices');

router.post("/createCategory" , categoryServices.createCategory);
router.post("/updateCategory" , categoryServices.updateCategory);
router.post("/deleteCategory" , categoryServices.deleteCategory);

module.exports = router;
