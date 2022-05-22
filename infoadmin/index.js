//REQUIRED NODE MODULES
var express = require('express');
var app = express();
var compression = require('compression');

app.use(compression());

var bodyParser = require('body-parser');
var sanitizer = require('express-sanitizer');
var methodOverride = require('method-override');
var path = require('path');
var indexRoute = require('./routes/index');
var customerRoute = require('./routes/customerRoute');
var categoryRoute = require('./routes/categoryRoute');
var couponsRoute = require('./routes/couponsRoute');
var subcategoryRoute = require('./routes/subCategoryRoute');
var productRoute = require('./routes/productRoute');
var cmsRoute = require('./routes/cmsRoute');
var sellerRoute = require('./routes/sellerRoute');
var apiRoute = require('./routes/apiRoute');
var deliverySlotRoute = require('./routes/deliverySlotRoute');
var pincodeRoute = require('./routes/pincodeRoute');
var orderRoute = require('./routes/orderRoute');
var cartRoute = require('./routes/cartRoute');
var bannerRoute = require('./routes/bannerRoute');
var mysql = require('mysql');
var session = require('express-session');
var cors = require('cors');
const fileUpload = require('express-fileupload');
var json2xls = require('json2xls');

// var pdf = require('express-pdf');
// app.use(pdf);


//SESSION Settings
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(function (req, res, next) {
  if (!req.session.registrationStep) {
    req.session.registrationStep = {}
  }
  if (!req.session.seller) {
    req.session.seller = {}
  }
  req.isAuthenticated = function(){
    if(!req.session.seller['profile']){
      return false;
    }
    return true;
  }
  next()
})
//SET
app.set('port', (process.env.PORT || 9229));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//USE
app.use(bodyParser.urlencoded({limit: '50mb', extended : true}));
app.use(methodOverride("_method"));
app.use(sanitizer());
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(json2xls.middleware);

//Static Content Settings
app.use(express.static(__dirname + '/views/publicContent',{ maxage: '300d' }));

//GLOBAL Variable
app.locals.globarDir = __dirname;

//ROUTES
app.use(indexRoute);
app.use(customerRoute);
app.use(categoryRoute);
app.use(couponsRoute);
app.use(subcategoryRoute);
app.use(productRoute);
app.use(cmsRoute);
app.use(sellerRoute);
app.use(apiRoute);
app.use(deliverySlotRoute);
app.use(pincodeRoute);
app.use(orderRoute);
app.use(cartRoute);
app.use(bannerRoute);

//Index Route
app.get("/", function(req, res){
    res.render('sellerLogin');
});
// app.get("/home", function(req, res){
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// });

//Global handling of undefined routes
app.get("*", function(req, res){
    res.render('sellerLogin');
});

//LISTEN PORT
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
