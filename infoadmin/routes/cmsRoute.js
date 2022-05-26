var express = require('express');
var router = express.Router();
var cmsServices = require('../models/cmsServices');
var isLoggedIn = function(req , res , next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/cms/login');
}

router.get("/cms" , isLoggedIn , cmsServices.renderCMS);
router.get("/cms/category" , isLoggedIn , cmsServices.renderCategory);
router.get("/cms/createPost" , isLoggedIn , cmsServices.renderCreatePost);
router.get("/cms/coupons" , isLoggedIn , cmsServices.renderCoupons);
router.get("/cms/subcategory" , isLoggedIn , cmsServices.renderSubCategory);
router.get("/cms/category/:catId" , isLoggedIn , cmsServices.renderCategoryDetails);
router.get("/cms/product" , isLoggedIn , cmsServices.renderProduct);
router.get("/cms/productSequence" , isLoggedIn , cmsServices.renderProductSequence);
router.get("/cms/seller" , isLoggedIn , cmsServices.renderSeller);
router.get("/cms/customer" , isLoggedIn , cmsServices.renderCustomer);
router.get("/cms/order" , isLoggedIn , cmsServices.renderOrder);
router.get("/cms/order/invoice/:orderId" , isLoggedIn , cmsServices.renderInvoice);
router.get("/cms/order/invoice/:orderId/print" , isLoggedIn , cmsServices.renderInvoicePrint);
router.get("/cms/deliveryslot" , isLoggedIn , cmsServices.renderDeliverySlot);
router.get("/cms/profile" , isLoggedIn , cmsServices.renderProfile);
router.get("/cms/profile/:profileId" , isLoggedIn , cmsServices.renderProfileDetails);
router.get("/cms/banner" , isLoggedIn , cmsServices.renderBanner);
router.get("/cms/signout" , cmsServices.renderSignout);
router.get("/cms/login" , cmsServices.renderLogin);
// router.get("/cms/getimage/:img" , cmsServices.renderImage);

module.exports = router;
