var express = require('express');
var router = express.Router();
//var router = express.Router({mergeParams : true});
var subCategoryServices = require('../models/subCategoryServices');

router.post("/createSubCategory" , subCategoryServices.createSubCategory);
router.post("/updateSubCategory" , subCategoryServices.updateSubCategory);
router.post("/deleteSubCategory" , subCategoryServices.deleteSubCategory);

module.exports = router;
