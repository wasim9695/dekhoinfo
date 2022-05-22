var myCms = (function(){
  var refreshAll = function(){
    setTimeout(function(){
      location.reload();
    } , 1000);
  }
  var getAjaxResponse = function(Url,Data,method,callbackFun){
    $.ajax({
      method: method,
      url: Url,
      data: Data
    }).done(function( msg ) {
      callbackFun(msg);
    });
  }
  /*inovice view*/
  var resShowInvoice = function(data){
    if(data!=null){
      $('#invoiceContents').html(data);
    }
  }
  var resShowDiscount = function(data){
    if(data!=null){
      $('#modal-invoice #invoiceContents').html(data);
    }
  }

  /*Product Methods*/
  var resDeleteProduct = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-danger').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resUploadImage = function(data){
    if(data!=null){
      if(data.status){
        setTimeout(function(){
          $('#modal-default').find('button[aria-label="Close"]').trigger("click");
          refreshAll();
        },2000);
      }
    }
  }
  var resFilterOrder = function(data){
    if(data!=null){
      $("#example11").DataTable().destroy();
      $('#example11').find('tbody').html(data);
      $("#example11").DataTable({
         'lengthChange': true,
         'searching'   : true,
         'ordering'    : true
      });
    }
  }
  var setMonthData = function(monthObject, dataObject, monthIndex){
    monthObject.m = '2019-'+('0' + (monthIndex)).slice(-2);
    if(dataObject.OrderStatus == 'delivered'){
      monthObject.a += parseInt(dataObject.OrderedQuantity);
      monthObject.b += parseInt(dataObject.DeliveredQuantity);
      monthObject.c += parseInt(dataObject.OrderedQuantity) - parseInt(dataObject.DeliveredQuantity);
    }else if(dataObject.OrderStatus == 'cancelled'){
      monthObject.a += parseInt(dataObject.OrderedQuantity);
      monthObject.b += 0;
      monthObject.c += parseInt(dataObject.DeliveredQuantity);
    }
    return monthObject;
  }
  var resShowGraphData = function(data){
    if(data!=null){
      if(data.status){
        var graphArray = [];
        var Jan = {
          m: '2019-01',
          a: 0,
          b: 0,
          c: 0
        },
        Feb = {
          m: '2019-02',
          a: 0,
          b: 0,
          c: 0
        },
        Mar = {
          m: '2019-03',
          a: 0,
          b: 0,
          c: 0

        },
        Apr = {
          m: '2019-04',
          a: 0,
          b: 0,
          c: 0

        },
        May = {
          m: '2019-05',
          a: 0,
          b: 0,
          c: 0
        },
        Jun = {
          m: '2019-06',
          a: 0,
          b: 0,
          c: 0

        },
        Jul = {
          m: '2019-07',
          a: 0,
          b: 0,
          c: 0

        },
        Aug = {
          m: '2019-08',
          a: 0,
          b: 0,
          c: 0

        },
        Sep = {
          m: '2019-09',
          a: 0,
          b: 0,
          c: 0

        },
        Oct = {
          m: '2019-10',
          a: 0,
          b: 0,
          c: 0

        },
        Nov = {
          m: '2019-11',
          a: 0,
          b: 0,
          c: 0

        },
        Dec = {
          m: '2019-12',
          a: 0,
          b: 0,
          c: 0

        };
        data.data.forEach(function(data,index){
          if((x = new Date(data.RecordTime)).getMonth()+1 == 1){
              Jan = setMonthData(Jan , data, 1);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 2){
              Feb = setMonthData(Feb , data, 2);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 3){
              Mar = setMonthData(Mar , data, 3);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 4){
              Apr = setMonthData(Apr , data, 4);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 5){
              May = setMonthData(May , data, 5);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 6){
              Jun = setMonthData(Jun , data, 6);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 7){
              Jul = setMonthData(Jul , data, 7);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 8){
              Aug = setMonthData(Aug , data, 8);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 9){
              Sep = setMonthData(Sep , data, 9);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 10){
              Oct = setMonthData(Oct , data, 10);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 11){
              Nov = setMonthData(Nov , data, 11);
          }
          else if((x = new Date(data.RecordTime)).getMonth()+1 == 12){
              Dec = setMonthData(Dec , data, 12);
          }
        });
        graphArray.push(Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec);
        MorisChart.setData(graphArray);
      }else{
        console.log('error');
      }
    }
  }

  var showProductDetails = function(data){
    if(data!=null){
      if(data.status){
        var htmlStr = "";
        htmlStr += '<table class="table table-bordered"><tbody><tr><th style="width: 8px">#</th><th>Product</th><th style="width: 70px">Qty</th><th style="width: 200px">Status</th></tr>';
        data.data.forEach(function(data,index){
          htmlStr += '<tr data-ProductOrderId="'+data.ProductOrderId+'" class="cancellable_row">';
          htmlStr += '<td>'+(index +1)+'</td><td>'+data.ProductName+'</td><td><input class="prdOrderQuantity" value="'+data.Qty+'" /> '+ data.WeightUnit +'</td>';
          if(data.ProductOrderStatus == "Cancelled" ){
            htmlStr += '<td><div class="order-status-action"><label class="text-green"><input type="radio" name="orderStatus_'+data.ProductOrderId+'" value="Delivered">Delivered</label><label class="text-red"><input type="radio" name="orderStatus_'+data.ProductOrderId+'" value="Cancelled" checked="">Cancelled</label></div></td>';
          }else{
            htmlStr += '<td><div class="order-status-action"><label class="text-green"><input type="radio" name="orderStatus_'+data.ProductOrderId+'" value="Delivered" checked="">Delivered</label><label class="text-red"><input type="radio" name="orderStatus_'+data.ProductOrderId+'" value="Cancelled">Cancelled</label></div></td>';
          }
          htmlStr += '</tr>';
        });
        htmlStr += '</tbody></table>';
        $('#cancellableProductList').html(htmlStr);
      }
    }
  }

  var resCreateProduct = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-success').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var editProduct = function(){
    var data = {};
    data.Id = $('#editProductForm #editprdId').val();
    data.Name = $('#editProductForm #editprdName').val();
    data.Weight = $('#editProductForm #editprdWeight').val();
    data.WeightUnit = $('#editProductForm #editPrdWeightUnit').val();
    data.Unit = data.Weight +' '+data.WeightUnit;
    data.Price = $('#editProductForm #editprdPrice').val();
    data.Quantity = $('#editProductForm #editprdQuantity').val();
    data.Description = $('#editProductForm #editprdDescription').val();
    data.Disclaimer = $('#editProductForm #editprdDisclaimer').val();
    data.DiscountPercentage = $('#editProductForm #editDiscountPercentage').val();
    data.Type = $('#editProductForm #editPrdType').val();
    if(data.DiscountPercentage > 0){
      data.DiscountPrice = data.Price - (data.DiscountPercentage * data.Price)/100;
    }else{
      data.DiscountPrice = 0;
    }
    data.IsTaxable = $('#editProductForm #editIsTaxable').get(0).checked;
    if(data.IsTaxable){
      data.IsTaxable = 1;
      data.TaxPercentage = $('#editProductForm #editTaxPercentage').val();
      if(data.TaxPercentage <= 0){
        $('#editProductForm #editTaxPercentage').parent().addClass('has-error');
        return;
      }
    }else{
      data.IsTaxable = 0;
      data.TaxPercentage = 0;
    }
    if((data.Name!=null && data.Name.length <= 1) || data.Name == undefined){
      $('#editProductForm input#editprdName').parent().addClass('has-error');
      return;
    }else{
      $('#editProductForm input#editprdName').parent().removeClass('has-error');
    }
    if((data.Unit!=null && (data.Unit).length <= 1) || data.Unit == undefined){
      $('#editProductForm input#editprdUnit').parent().addClass('has-error');
      return;
    }else{
      $('#editProductForm input#editprdUnit').parent().removeClass('has-error');
    }
    if((data.Price!=null && (data.Price).length <= 1) || data.Price == undefined){
      $('#editProductForm input#editprdPrice').parent().addClass('has-error');
      return;
    }else{
      $('#editProductForm input#editprdPrice').parent().removeClass('has-error');
    }
    getAjaxResponse("/updateProduct" , data ,"post", resEditCategory);
  }
  var deleteProduct = function(){
    var data = {};
    var prdId = $('#deleteProductForm #deletePrdId').val();
    data.Id = prdId;
    getAjaxResponse("/deleteProduct" , data ,"post", resDeleteProduct);
  }
  var openEditProduct = function(_this){
    var prdName = $('#prd_'+_this.attr('data-prdId')).find('.prdName').text().trim();
    var prdWeight = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenWeight').val();
    var prdWeightUnit = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenWeightUnit').val();
    var prdPrice = $('#prd_'+_this.attr('data-prdId')).find('.prdPrice').text().trim();
    var prdQuantity = $('#prd_'+_this.attr('data-prdId')).find('.prdQuantity').text().trim();
    var prdDescription = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenDescription').val();
    var prdDisclaimer = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenDisclaimer').val();
    var prdType = $(_this).attr('data-prdType');
    $('#editProductForm #editprdId').val(_this.attr('data-prdId'));
    $('#editProductForm #editprdName').val(prdName);
    $('#editProductForm #editprdWeight').val(prdWeight);
    $('#editProductForm #editPrdWeightUnit').val(prdWeightUnit);
    $('#editProductForm #editprdPrice').val(prdPrice);
    $('#editProductForm #editprdQuantity').val(prdQuantity);
    $('#editProductForm #editprdDescription').val(prdDescription);
    $('#editProductForm #editprdDisclaimer').val(prdDisclaimer);
    $('#editProductForm #editPrdType').val(prdType);


    var prdDiscountPercentage = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenDiscountPercentage').val();
    var prdDiscountPrice = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenDiscountPrice').val();
    var prdIsTaxable = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenIsTaxable').val();
    var prdTaxPercentage = $('#prd_'+_this.attr('data-prdId')).find('.prdHiddenTaxPercentage').val();

    $('#editProductForm #editDiscountPercentage').val(prdDiscountPercentage);
    $('#editProductForm #editDiscountPrice').val(prdDiscountPrice);
    $('#editProductForm #editTaxPercentage').val(prdTaxPercentage);
    if(prdIsTaxable == 1){
      $('#editProductForm #editIsTaxable').attr('checked' , true);
    }else{
      $('#editProductForm #editIsTaxable').attr('checked' , false);
    }
  }
  var openDeleteProduct = function(_this){
    $('#deleteProductForm #deletePrdId').val(_this.attr('data-prdId'));
  }
  var openCreateProduct = function(_this){
    $('#newProductForm #prdCatId').val(_this.attr('data-categoryId'));
    $('#newProductForm #prdSubCatId').val(_this.attr('data-subCategoryId'));
    $('#newProductForm #prdSellerId').val(_this.attr('data-sellerId'));
  }
  var createProduct = function(_this){
    var data = {};
    data.CategoryId = $('#newProductForm #prdCatId').val();
    data.SubCategoryId = $('#newProductForm #prdSubCatId').val();
    data.SellerId = $('#newProductForm #prdSellerId').val();
    data.Name = $('#newProductForm #prdName').val();
    data.activeprd = $('#newProductForm #addactiveinactive').val();
    data.Type = $('#newProductForm #addPrdType').val();
    data.Price = $('#newProductForm #prdPrice').val();
    data.Quantity = $('#newProductForm #prdQuantity').val();
    data.Description = $('#newProductForm #prdDescription').val();
    data.Disclaimer = $('#newProductForm #prdDisclaimer').val();
    data.DiscountPercentage = $('#newProductForm #prdDiscountPercentage').val();
    // add column start here

    data.SKU = $('#newProductForm #addprdsku').val();
    data.Dlocalcharge = $('#newProductForm #Dlocalcharge').val();
    data.zonalcharge = $('#newProductForm #zonalcharge').val();
    data.nationalcharge = $('#newProductForm #nationalcharge').val();
    data.packageweight = $('#newProductForm #packageweight').val();
    data.packagelenght = $('#newProductForm #packagelenght').val();
    data.packagebreath = $('#newProductForm #packagebreath').val();
    data.packageheight = $('#newProductForm #packageheight').val();
    data.manufdetail = $('#newProductForm #manufdetail').val();
    data.importerdetail = $('#newProductForm #importerdetail').val();
    data.packagedetail = $('#newProductForm #packagedetail').val();
    data.countryorizin = $('#newProductForm #countryorizin').val();
    data.manufdate = $('#newProductForm #manufdate').val();
    // end here
    if(data.DiscountPercentage > 0){
      data.DiscountPrice = data.Price - (data.DiscountPercentage * data.Price)/100;
    }else{
      data.DiscountPrice = 0;
    }
    data.IsTaxable = $('#newProductForm #prdIsTaxable').get(0).checked;
    if(data.IsTaxable){
      data.IsTaxable = 1;
      data.TaxPercentage = $('#newProductForm #prdTaxPercentage').val();
      if(data.TaxPercentage <= 0){
        $('#newProductForm #prdTaxPercentage').parent().addClass('has-error');
        return;
      }
    }else{
      data.IsTaxable = 0;
      data.TaxPercentage = 0;
    }
    // debugger;
    if((data.Name!=null && data.Name.length <= 1) || data.Name == undefined){
      $('#newProductForm input#prdName').parent().addClass('has-error');
      return;
    }else{
      $('#editCategoryForm input#prdName').parent().removeClass('has-error');
    }
    if((data.Unit!=null && (data.Unit).length <= 1) || data.Unit == undefined){
      $('#newProductForm input#prdUnit').parent().addClass('has-error');
      return;
    }else{
      $('#editCategoryForm input#prdUnit').parent().removeClass('has-error');
    }
    if((data.Price!=null && (data.Price).length <= 1) || data.Price == undefined){
      $('#newProductForm input#prdPrice').parent().addClass('has-error');
      return;
    }else{
      $('#editCategoryForm input#prdPrice').parent().removeClass('has-error');
    }
    getAjaxResponse("/createProduct" , data ,"post", resCreateProduct);

    console(data);
  }

  /*Category Methods*/
  var resCreateCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-success').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resEditCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-warning').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resDeleteCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-danger').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var createCategory = function(){
    var data = {};
    var catName = $('#newCategoryForm input#newCatName').val();
    if((catName!=null && catName.length <= 1) || catName == undefined){
      $('#newCategoryForm input#newCatName').parent().addClass('has-error');
      return;
    }else{
      $('#newCategoryForm input#newCatName').parent().removeClass('has-error');
    }
    data.Name = catName;
    data.Description = $('#newCategoryForm #newCatDesc').val();
    getAjaxResponse("/createCategory" , data ,"post", resCreateCategory);
  }
  var editCategory = function(){
    var data = {};
    var catId = $('#editCategoryForm #editCatId').val();
    var catName = $('#editCategoryForm #editCatName').val();
    var catDescription = $('#editCategoryForm #editCatDesc').val();
    if((catName!=null && catName.length <= 1) || catName == undefined){
      $('#editCategoryForm input#editCatName').parent().addClass('has-error');
      return;
    }else{
      $('#editCategoryForm input#editCatName').parent().removeClass('has-error');
    }
    data.Id = catId;
    data.Name = catName;
    data.Description = catDescription;
    getAjaxResponse("/updateCategory" , data ,"post", resEditCategory);
  }
  var deleteCategory = function(){
    var data = {};
    var catId = $('#deleteCategoryForm #deleteCatId').val();
    data.Id = catId;
    getAjaxResponse("/deleteCategory" , data ,"post", resDeleteCategory);
  }
  var openEditCategory = function(_this){
    var catName = $('#'+_this.attr('data-catId')).find('.catName').text();
    var catDesc = $('#'+_this.attr('data-catId')).find('.catDesc').text();
    $('#editCategoryForm #editCatId').val(_this.attr('data-catId'));
    $('#editCategoryForm #editCatName').val(catName);
    $('#editCategoryForm #editCatDesc').val(catDesc);
  }
  var openDeleteCategory = function(_this){
    var catId = _this.attr('data-catId');
    $('#deleteCategoryForm #deleteCatId').val(_this.attr('data-catId'));
  }
  /*Coupons*/

  var createCoupons = function(){
    var data = {};
    var CouponCode = $('#newCouponsForm input#newCouponsCode').val();
    if((CouponCode!=null && CouponCode.length <= 1) || CouponCode == undefined){
      $('#newCouponsForm input#newCouponsCode').parent().addClass('has-error');
      return;
    }else{
      $('#newCouponsForm input#newCouponsCode').parent().removeClass('has-error');
    }
    var assignTo = $('#newCouponsForm #newSellerId').val();
    if(assignTo < 1){
      $('#newCouponsForm #newSellerId').parent().addClass('has-error');
      return;
    }else{
      $('#newCouponsForm #newSellerId').parent().removeClass('has-error');
    }
    data.CouponCode = CouponCode;
    data.AssignedTo = assignTo;
    data.Discount = $('#newCouponsForm #newDiscount').val();
    getAjaxResponse("/createCoupons" , data ,"post", resDeleteCategory);
  }
  var editCoupons = function(){
    var data = {};
    var editCouponsId = $('#editCouponsForm #editCouponsId').val();
    var editCouponsCode = $('#editCouponsForm #editCouponsCode').val();
    var editDiscount = $('#editCouponsForm #editDiscount').val();
    var editAssignedTo = $('#editCouponsForm #editSellerId').val();
    if((editCouponsCode!=null && editCouponsCode.length <= 1) || editCouponsCode == undefined){
      $('#editCouponsForm input#editCouponsCode').parent().addClass('has-error');
      return;
    }else{
      $('#editCouponsForm input#editCouponsCode').parent().removeClass('has-error');
    }
    data.Id = editCouponsId;
    data.CouponCode = editCouponsCode;
    data.AssignedTo = editAssignedTo;
    data.Discount = editDiscount;
    getAjaxResponse("/updateCoupons" , data ,"post", resDeleteCategory);
  }
  var deleteCoupons = function(){
    var data = {};
    var deleteCouponsId = $('#deleteCouponsForm #deleteCouponsId').val();
    data.Id = deleteCouponsId;
    getAjaxResponse("/deleteCoupons" , data ,"post", resDeleteCategory);
  }
  var openEditCoupons = function(_this){
    var CouponsCode = $('#'+_this.attr('data-catId')).find('.couponsCode').text();
    var AssignedTo = $('#'+_this.attr('data-catId')).find('.assignedTo').text();
    var Discount = $('#'+_this.attr('data-catId')).find('.discount').text();
    $('#editCouponsForm #editCouponsId').val(_this.attr('data-catId'));
    $('#editCouponsForm #editCouponsCode').val(CouponsCode);
    $('#editCouponsForm #editSellerId').val(AssignedTo);
    $('#editCouponsForm #editDiscount').val(Discount);
  }
  var openDeleteCoupons = function(_this){
    var catId = _this.attr('data-catId');
    $('#deleteCouponsForm #deleteCouponsId').val(_this.attr('data-catId'));
  }


  /* Sub Category Methods*/
  var resCreateSubCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-success').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resEditSubCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-warning').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resDeleteSubCategory = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-danger').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var createSubCategory = function(){
    var data = {};
    var catName = $('#newSubCategoryForm input#newCatName').val();
    if((catName!=null && catName.length <= 1) || catName == undefined){
      $('#newSubCategoryForm input#newCatName').parent().addClass('has-error');
      return;
    }else{
      $('#newSubCategoryForm input#newCatName').parent().removeClass('has-error');
    }
    data.CategoryId = $('#newSubCategoryForm input#newCatId').val();
    data.Name = catName;
    data.Description = $('#newSubCategoryForm #newCatDesc').val();
    getAjaxResponse("/createSubCategory" , data ,"post", resCreateSubCategory);
  }
  var editSubCategory = function(){
    var data = {};
    var catId = $('#editSubCategoryForm #editCatId').val();
    var catName = $('#editSubCategoryForm #editCatName').val();
    var catDescription = $('#editSubCategoryForm #editCatDesc').val();
    if((catName!=null && catName.length <= 1) || catName == undefined){
      $('#editSubCategoryForm input#editCatName').parent().addClass('has-error');
      return;
    }else{
      $('#editSubCategoryForm input#editCatName').parent().removeClass('has-error');
    }
    data.Id = catId;
    data.Name = catName;
    data.Description = catDescription;
    getAjaxResponse("/updateSubCategory" , data ,"post", resEditSubCategory);
  }
  var deleteSubCategory = function(){
    var data = {};
    var catId = $('#deleteSubCategoryForm #deleteCatId').val();
    data.Id = catId;
    getAjaxResponse("/deleteSubCategory" , data ,"post", resDeleteCategory);
  }
  var openEditSubCategory = function(_this){
    var catName = $('#subcat_'+_this.attr('data-catId')).find('.catName').text().trim();
    var catDesc = $('#subcat_'+_this.attr('data-catId')).find('.catDesc').text().trim();
    $('#editSubCategoryForm #editCatId').val(_this.attr('data-catId'));
    $('#editSubCategoryForm #editCatName').val(catName);
    $('#editSubCategoryForm #editCatDesc').val(catDesc);
  }
  var openDeleteSubCategory = function(_this){
    var catId = _this.attr('data-catId');
    $('#deleteSubCategoryForm #deleteCatId').val(_this.attr('data-catId'));
  }
  var openAddSubCategory = function(_this){
    $('#newSubCategoryForm input#newCatId').val(_this.attr('data-categoryid'));
  }


  /*Slot Methods*/
  var resCreateSlot = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-success').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resEditSlot = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-warning').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resDeleteSlot = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-danger').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var openEditSlot = function(_this){
    var SlotName = $('tr#'+_this.attr('data-catId')+'.slot').find('.SlotName').text();
    var TimeSlot = $('tr#'+_this.attr('data-catId')+'.slot').find('.TimeSlot').text();
    $('#editSlotForm #editSlotId').val(_this.attr('data-catId'));
    $('#editSlotForm #editSlotName').val(SlotName);
    var data = {};
    data.fromTime = TimeSlot.split(' - ')[0].trim().split(' ')[0];
    data.fromAmPm = TimeSlot.split(' - ')[0].trim().split(' ')[1];
    data.endTime = TimeSlot.split(' - ')[1].trim().split(' ')[0];
    data.endAmPm = TimeSlot.split(' - ')[1].trim().split(' ')[1];
    $('#editSlotForm select[name="fromTime"]').val([data.fromTime]);
    $('#editSlotForm select[name="fromAmPm"]').val([data.fromAmPm]);
    $('#editSlotForm select[name="endTime"]').val([data.endTime]);
    $('#editSlotForm select[name="endAmPm"]').val([data.endAmPm]);
  }
  var openDeleteSlot = function(_this){
    var catId = _this.attr('data-catId');
    $('#deleteSlotForm #deleteSlotId').val(_this.attr('data-catId'));
  }
  var createSlot = function(){
    var data = {};
    var slotName = $('#newSlotForm input#addSlotName').val();
    var fromTime = $('#newSlotForm select[name="fromTime"]').val();
    var endTime = $('#newSlotForm select[name="endTime"]').val();
    var fromAmPm = $('#newSlotForm select[name="fromAmPm"]').val();
    var endAmPm = $('#newSlotForm select[name="endAmPm"]').val();
    if((slotName!=null && slotName.length <= 1) || slotName == undefined){
      $('#newSlotForm input#addSlotName').parent().addClass('has-error');
      return;
    }else{
      $('#newSlotForm input#addSlotName').parent().removeClass('has-error');
    }
    if((fromTime <= 0 ) || fromTime == undefined){
      $('#newSlotForm select[name="fromTime"]').parent().addClass('has-error');
      return;
    }else{
      $('#newSlotForm select[name="fromTime"]').parent().removeClass('has-error');
    }
    if((endTime <= 0) || endTime == undefined){
      $('#newSlotForm select[name="endTime"]').parent().addClass('has-error');
      return;
    }else{
      $('#newSlotForm select[name="endTime"]').parent().removeClass('has-error');
    }
    data.SlotName = slotName;
    data.TimeSlot = fromTime+" "+fromAmPm+" - "+endTime+" "+endAmPm;;
    getAjaxResponse("/createDeliverySlot" , data ,"post", resCreateCategory);
  }
  var editSlot = function(){
    var data = {};
    var catId = $('#editSlotForm #editSlotId').val();
    var SlotName = $('#editSlotForm #editSlotName').val();
    var fromTime = $('#editSlotForm select[name="fromTime"]').val();
    var endTime = $('#editSlotForm select[name="endTime"]').val();
    var fromAmPm = $('#editSlotForm select[name="fromAmPm"]').val();
    var endAmPm = $('#editSlotForm select[name="endAmPm"]').val();
    if((SlotName!=null && SlotName.length <= 1) || SlotName == undefined){
      $('#editSlotForm input#editSlotName').parent().addClass('has-error');
      return;
    }else{
      $('#editSlotForm input#editSlotName').parent().removeClass('has-error');
    }
    if((fromTime <= 0 ) || fromTime == undefined){
      $('#editSlotForm select[name="fromTime"]').parent().addClass('has-error');
      return;
    }else{
      $('#editSlotForm select[name="fromTime"]').parent().removeClass('has-error');
    }
    if((endTime <= 0) || endTime == undefined){
      $('#editSlotForm select[name="endTime"]').parent().addClass('has-error');
      return;
    }else{
      $('#editSlotForm select[name="endTime"]').parent().removeClass('has-error');
    }
    data.Id = catId;
    data.SlotName = SlotName;
    data.TimeSlot = fromTime+" "+fromAmPm+" - "+endTime+" "+endAmPm;;
    getAjaxResponse("/updateDeliverySlot" , data ,"post", resEditSlot);
  }
  var deleteSlot = function(){
    var data = {};
    var catId = $('#deleteSlotForm #deleteSlotId').val();
    data.Id = catId;
    getAjaxResponse("/deleteDeliverySlot" , data ,"post", resDeleteSlot);
  }

  /*Pincode Methods*/
  var deletePincode = function(){
    var data = {};
    var catId = $('#deletePincodeForm #deletePincodeId').val();
    data.Id = catId;
    getAjaxResponse("/deletePincode" , data ,"post", resDeletePincode);
  }
  var resPincode = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-success').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resEditPincode = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-warning').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var resDeletePincode = function(data){
    if(data!=null){
      if(data.status){
        $('#modal-danger').find('button[aria-label="Close"]').trigger("click");
        refreshAll();
      }
    }
  }
  var openEditPincode = function(_this){
    var pincode = $('tr#'+_this.attr('data-catId')+'.pincode').find('.pincode').text();
    var slotId = $('tr#'+_this.attr('data-catId')+'.pincode').find('.slotId').attr('data-slotId')
    var dayId = $('tr#'+_this.attr('data-catId')+'.pincode').find('.dayaname').attr('data-dayId')
    $('#editPincodeForm #editPincodeId').val(_this.attr('data-catId'));
    $('#editPincodeForm #editPincodeName').val(pincode);
    $('#editPincodeForm select[name="DeliveryDayId"]').val([dayId]);
    $('#editPincodeForm select[name="DeliverySlotId"]').val([slotId]);
  }
  var openDeletePincode = function(_this){
    var catId = _this.attr('data-catId');
    $('#deletePincodeForm #deletePincodeId').val(_this.attr('data-catId'));
  }
  var createPincode = function(){
    var data = {};
    var catName = $('#newPincodeForm input#newPincode').val();
    if((catName!=null && catName.length <= 1) || catName == undefined){
      $('#newPincodeForm input#newPincode').parent().addClass('has-error');
      return;
    }else{
      $('#newPincodeForm input#newPincode').parent().removeClass('has-error');
    }
    data.Pincode = catName;
    data.DeliverySlotId = $('#newPincodeForm select[name="DeliverySlotId"]').val();
    data.DeliveryDayId = $('#newPincodeForm select[name="DeliveryDayId"]').val();
    alert(data.DeliveryDayId);
    if(data.DeliveryDayId == ''){
      $('#newPincodeForm select[name="DeliveryDayId"]').parents('.form-group').addClass('has-error');
      return;
    }else{
      $('#newPincodeForm select[name="DeliveryDayId"]').parents('.form-group').removeClass('has-error');
    }

    if(data.DeliverySlotId == ''){
      $('#newPincodeForm select[name="DeliverySlotId"]').parents('.form-group').addClass('has-error');
      return;
    }else{
      $('#newPincodeForm select[name="DeliverySlotId"]').parents('.form-group').removeClass('has-error');
    }
    getAjaxResponse("/createPincode" , data ,"post", resCreateCategory);
  }
  var editPincode = function(){
    var data = {};
    var catId = $('#editPincodeForm #editPincodeId').val();
    var Pincode = $('#editPincodeForm #editPincodeName').val();
    var DeliverySlotId = $('#editPincodeForm select[name="DeliverySlotId"]').val();
    var DeliveryDayId = $('#editPincodeForm select[name="DeliveryDayId"]').val();
    if((Pincode!=null && Pincode.length <= 5) || Pincode == undefined){
      $('#editPincodeForm input#editPincodeName').parent().addClass('has-error');
      return;
    }else{
      $('#editPincodeForm input#editPincodeName').parent().removeClass('has-error');
    }
    data.Id = catId;
    data.Pincode = Pincode;
    data.DeliverySlotId = DeliverySlotId;
    data.DeliveryDayId = DeliveryDayId;
    getAjaxResponse("/updatePincode" , data ,"post", resEditPincode);
  }

  /*Customers Methods*/
  var openAproveCustomer = function(_this){
    $('#aproveCustomerForm #aproveCustomerId').val(_this.attr('data-Id'));
  }
  var openSuspendCustomer = function(_this){
    $('#suspendCustomerForm #suspendCustomerId').val(_this.attr('data-Id'));
  }
  var aproveCustomer = function(){
    var data = {};
    var catId = $('#aproveCustomerForm #aproveCustomerId').val();
    data.Id = catId;
    getAjaxResponse("/aproveCustomer" , data ,"post", resDeleteSlot);
  }
  var suspendCustomer = function(){
    var data = {};
    var catId = $('#suspendCustomerForm #suspendCustomerId').val();
    data.Id = catId;
    getAjaxResponse("/suspendCustomer" , data ,"post", resDeleteSlot);
  }
  /*apply coupon code*/
  var applyCouponCode = function(orderId){
    var data = {};
    data.OrderId = orderId;
    data.CouponCode = $('#managerCouponCode').val();
    getAjaxResponse("/applyCouponCode" , data ,"post", function(resp){
      if(resp.status == false){
          alert(resp.message);
      }else{
          getAjaxResponse($('a.rowViewInvoice[data-orderid="'+orderId+'"]').attr('data-href') , null ,"get", resShowDiscount);
      }
    });
  }
  /*Print my invoice*/
  var printmyinvoice = function(orderId){
    $('#printmyinvoice').attr('src' , '/cms/order/invoice/'+orderId+'/print');
  }
  /*Image upload functionality*/
  var basic = $('#demo-basic').croppie({
    viewport: {
        width: 300,
        height: 250,
    },
    boundary: {
        width: 1000,
        height: 300
    }
  });
  var iniatlizeCrop = function(_this){
    var myImgUrl = window.URL.createObjectURL(_this.files[0]);
    basic.croppie('bind', {
      url: myImgUrl,
      points: [77, 469, 280, 739]
    });
    $('#cropWraper').show();
    //$('#openCrop').click();
  }
  var getCropResult = function(setCropedSrc){
    basic.croppie('result',
    {
      type: 'canvas',
      size: 'viewport'
    }).then(function (resp){
      setCropedSrc(resp);
      //$('#closeCrop').click();
        $('#cropWraper').hide();
    });
  }
  var setCropedSrc = function(data){
    var _this = $('#cropIt');
    $('img#'+_this.attr('data-imageId')).attr('src' , data);
    $('input[name="'+_this.attr('data-imageId')+'"]').val(data);
  }
  var setProductImageSrc =  function(data){
    $('.galerLayer img').attr("src","");
    if(data!=null){
      if(data.status){
        $.each(data.data, function( key, value ) {
          $('.galerLayer img#'+value.ImageType).attr('src' , value.ImageName);
          $('.galerLayer img#'+value.ImageType).parent().siblings().find('a[data-imgtype]').show();
        });
      }
    }
  }
  var encodeImageFileAsURL = function(srcInputElement , destInputElement) {
     var file = srcInputElement.files[0];
     var reader = new FileReader();
     reader.onloadend = function() {
       $('#'+destInputElement).val(reader.result);
     }
     reader.readAsDataURL(file);
   }

   /*banner image functions*/
   var openEditBanner = function(_this){
     var catName = $('#'+_this.attr('data-catId')).find('.catName').text();
     var catDesc = $('#'+_this.attr('data-catId')).find('.catDesc').text();
     $('#editBannerForm #editBannerId').val(_this.attr('data-catId'));
     $('#editBannerForm #editBannerImg').attr('src' , $('#'+_this.attr('data-catId')).find('.img-bnr-image').attr('src'))
     $('#editBannerForm #editBannerName').val(catName);
     $('#editBannerForm #editBannerDescription').val(catDesc);
     $('#editBannerForm #editLinkText').val($('#'+_this.attr('data-catId')).find('.catLinkText').text());
     $('#editBannerForm #editBannerLink').val($('#'+_this.attr('data-catId')).find('.catBannerLink').text());
   }
   var editBanner = function(){
     var data = {};
     data.Id = $('#editBannerForm #editBannerId').val();
     data.BannerName = $('#editBannerForm #editBannerName').val();
     data.BannerLink = $('#editBannerForm #editBannerLink').val();
     data.LinkText = $('#editBannerForm #editLinkText').val();
     data.BannerDescription = $('#editBannerForm #editBannerDescription').val();
     data.BannerImage = $('#editBannerForm #editBannerImage').val();
     getAjaxResponse("/updateBanner" , data ,"post", resEditCategory);
   }
   var OpenActivateBanner = function(data){
     $('#activateBannerForm #activationBannerId').val(data.Id);
     $('#activateBannerForm #IsActiveBanner').val(data.IsActive);
   }
   var activateDeactivateBanner = function(){
     var data = {};
     data.Id = $('#activateBannerForm #activationBannerId').val();
     data.IsActive = $('#activateBannerForm #IsActiveBanner').val();
     getAjaxResponse("/activateDeActivateBanner" , data ,"post", resEditCategory);
   }
  var setStorage = function(key ,value){
    sessionStorage.setItem(key, value);
  }
  var getStorage = function(key){
    return sessionStorage.getItem(key);
  }
  var OpenMeFirst = function(tabValue){
      $('a[href$="'+tabValue+'"]').click();
  }


  var bindEvent = (function(){
    /*record selected tab*/
    $('a[href*="tab_"]').click(function(){
      setStorage('selctedTab' , $(this).attr('href'));
    });
    /*multiselect*/
    $('select[multiple="multiple"]').multiselect();
    /*Banner Image*/
    $('.editBanner').on('click' , function(){
      openEditBanner($(this));
    })
    $('#editBanner').on('click' , function(){
      editBanner($(this));
    })
    /*Croping*/
    $('#closeCrop').on('click' , function(){
      $('#cropWraper').hide();
    });
    /*Delivery Slot*/
    $('#createNewSlot').on('click' , function(){
      createSlot();
    })
    $('.editSlot').on('click' , function(){
      openEditSlot($(this));
    })
    $('#editSlot').on('click' , function(){
      editSlot();
    })
    $('.deleteSlot').on('click' , function(){
      openDeleteSlot($(this));
    })
    $('#deleteSlot').on('click' , function(){
      deleteSlot($(this));
    })

    /*Pincode*/
    $('#createNewPincode').on('click' , function(){
      createPincode();
    })
    $('.editPincode').on('click' , function(){
      openEditPincode($(this));
    })
    $('#editPincode').on('click' , function(){
      editPincode();
    })
    $('.deletePincode').on('click' , function(){
      openDeletePincode($(this));
    })
    $('#deletePincode').on('click' , function(){
      deletePincode($(this));
    })

    /*Sub Category*/
    $('#createNewSubCategory').on('click' , function(){
      createSubCategory();
    })
    $('.editSubCat').on('click' , function(){
      openEditSubCategory($(this));
    })
    $('#editSubCategory').on('click' , function(){
      editSubCategory();
    })
    $('.deleteSubCat').on('click' , function(){
      openDeleteSubCategory($(this));
    })
    $('#deleteSubCategory').on('click' , function(){
      deleteSubCategory();
    })
    $('.addNewSubCat').on('click' , function(){
      openAddSubCategory($(this));
    })

    /*Category*/
    $('#createNewCategory').on('click' , function(){
      createCategory();
    })
    $('.editCat').on('click' , function(){
      openEditCategory($(this));
    })
    $('#editCategory').on('click' , function(){
      editCategory();
    })
    $('.deleteCat').on('click' , function(){
      openDeleteCategory($(this));
    })
    $('#deleteCategory').on('click' , function(){
      deleteCategory();
    })

    /*Coupons*/
    $('#createNewCoupons').on('click' , function(){
      createCoupons();
    })
    $('.editCat').on('click' , function(){
      openEditCoupons($(this));
    })
    $('#editCoupons').on('click' , function(){
      editCoupons();
    })
    $('.deleteCat').on('click' , function(){
      openDeleteCoupons($(this));
    })
    $('#deleteCoupons').on('click' , function(){
      deleteCoupons();
    })


    /* Product */
    $('#editProduct').on('click' , function(){
      editProduct();
    })
    $('#deleteProduct').on('click' , function(){
      deleteProduct();
    })
    $('.editPrd').on('click' , function(){
      openEditProduct($(this));
    })
    $('.deletePrd').on('click' , function(){
      openDeleteProduct($(this));
    })
    $('.addNewPrd').on('click' , function(){
      openCreateProduct($(this));
    })
    $('#createNewProduct').on('click' , function(){
      createProduct();
    });

    /* Customers */
    $('#aproveCustomer').on('click' , function(){
      aproveCustomer();
    })
    $('#suspendCustomer').on('click' , function(){
      suspendCustomer();
    })
    $('.aproveCustomer').on('click' , function(){
      openAproveCustomer($(this));
    })
    $('.suspendCustomer').on('click' , function(){
      openSuspendCustomer($(this));
    })
    $('.rowViewInvoice').on('click', function(){
      $('#printmyinvoiceId').val($(this).attr('data-orderId'));
      $('#invoiceContents').html('');
      getAjaxResponse($(this).attr('data-href') , null ,"get", resShowInvoice);
    })
    $('.rowPrintInvoice').on('click', function(){
      printmyinvoice($(this).attr('data-orderId'));
    })
    $('#btnDownloadPDF').on('click' , function(){
      printmyinvoice($('#printmyinvoiceId').val());
      $('#modal-invoice').find('button[aria-label="Close"]').trigger("click");
    })
    $('#applyCouponCode').on('click' , function(){
      applyCouponCode($('#printmyinvoiceId').val());
    })
    /* Image */
    $("#createNewBanner").on('click',function(){
      var Data = {};
      Data.BannerImage = $('#BannerImage').val();
      Data.BannerName = $('#BannerName').val();
      Data.BannerDescription = $('#BannerDescription').val();
      Data.BannerLink = $('#BannerLink').val();
      Data.LinkText = $('#LinkText').val();
      getAjaxResponse("/createBanner" , Data ,"post", resUploadImage);
    });
    $("#btn_uploadProductImages").on('click',function(){
      var Data = {};
      Data.bannerImg = $('#frm_uploadProductImages input[name="bannerImg"]').val();
      Data.ThumbImg1 = $('#frm_uploadProductImages input[name="ThumbImg1"]').val();
      Data.ThumbImg2 = $('#frm_uploadProductImages input[name="ThumbImg2"]').val();
      Data.ThumbImg3 = $('#frm_uploadProductImages input[name="ThumbImg3"]').val();
      Data.ThumbImg4 = $('#frm_uploadProductImages input[name="ThumbImg4"]').val();
      Data.ThumbImg5 = $('#frm_uploadProductImages input[name="ThumbImg5"]').val();
      Data.ProductId = $('#frm_uploadProductImages #imgProductId').val();
      getAjaxResponse("/uploadProductImages" , Data ,"post", resUploadImage);
      //$("#frm_uploadProductImages").submit();
    });
    $('.change-img').on('click',function(){
      var data = {};
      data.ProductId = $(this).attr('data-pid');
      $('#frm_uploadProductImages #imgProductId').val($(this).attr('data-pid'));
      getAjaxResponse("/getProductImages/"+data.ProductId , data ,"GET", setProductImageSrc);
    });
    $('.orderChangeStatus').on('click',function(){
      $('#changeOrderStatusForm #ordOrderId').val($(this).attr('data-orderId'));
      var data = {};
      data.OrderId = $(this).attr('data-orderId');
      getAjaxResponse("/getSingleOrderDetails" , data ,"POST", showProductDetails);
    });
    $('#btnChangeOrderStatus').on('click',function(){
      var data = {};
      data.Id = $('#changeOrderStatusForm #ordOrderId').val();
      data.ProductsStatus = [];// $('#changeOrderStatusForm input[name="orderStatus"]:checked').val();
      var count = 0;
      $('.cancellable_row').each(function(index,rowdata){
        var x = {};
        x.Id = $(rowdata).attr('data-productorderid');
        x.OrderStatus = $(rowdata).find('input[name^="orderStatus"]:checked').val();
        x.Quantity = $(rowdata).find('input.prdOrderQuantity').val();
        if(x.OrderStatus == 'Cancelled'){
          count++;
        }
        data.ProductsStatus.push(x);
      });
      if($('.cancellable_row').length == count){
        data.Status = 'Cancelled';
      }else{
        data.Status = 'Delivered';
      }
      console.log(data);
      getAjaxResponse("/changeOrderStatus", data ,"POST", resEditSlot);
    });
    $('input[id="productBannerImage"] , input[id^="inputThumbImg"]').change(function(){
      iniatlizeCrop($(this).get(0));
      $('#cropIt').attr('data-inputId' , $(this).attr('id'));
      $('#cropIt').attr('data-imageId' , $(this).siblings('img').attr('id'));
    });
    $('#newBannerForm input[id="hpBannerImage"] , #editBannerForm input[id="editHpBannerImage"]').change(function(){
      $(this).siblings('img').attr('src' , window.URL.createObjectURL(this.files[0]));
      encodeImageFileAsURL($(this).get(0) , $(this).siblings('input').attr('id'));
    });

    $('.activateBanner , .deActivateBanner').on('click', function(){
      var Data = {};
      Data.Id = $(this).attr('data-catId');
      Data.IsActive = $(this).attr('data-val');
      OpenActivateBanner(Data);
    });
    $('#activateBanner').on('click', function(){
      activateDeactivateBanner();
    });
    $('#exportOrderData').on('click', function(){
      window.open("/getOrderDataInXls" , '');
    });
    $('#exportCustomerData').on('click', function(){
      window.open("/getCustomerDetailsInXls" , '');
    });

    $('#cropIt').on('click' , function(){
      getCropResult(setCropedSrc);
    });
    $('input[name="IsTaxable"]').change(function(){
      if($(this).is(':checked')){
        $('input[name="TaxPercentage"]').removeAttr('disabled');
      }else{
        $('input[name="TaxPercentage"]').attr('disabled' , 'true').val(0);
      }
    })

    $('#editDiscountPercentage , #editprdPrice , #editTaxPercentage').on('keyup' , function(){
      var data = {};
      data.Price = $('#editProductForm #editprdPrice').val();
      data.DiscountPercentage = $('#editProductForm #editDiscountPercentage').val();
      data.Taxable = $('#editProductForm #editTaxPercentage').val();
      if(data.DiscountPercentage > 0){
        data.DiscountPrice = data.Price - (data.DiscountPercentage * data.Price)/100;
        if(data.Taxable > 0){
          data.DiscountPrice = data.DiscountPrice + (data.DiscountPrice * data.Taxable)/100;
        }
        $('#editDiscountPrice').val(data.DiscountPrice);
      }else{
        $('#editDiscountPrice').val('');
      }
    });
    $('#prdDiscountPercentage , #prdPrice , #prdTaxPercentage').on('keyup' , function(){
      var data = {};
      data.Price = $('#newProductForm #prdPrice').val();
      data.DiscountPercentage = $('#newProductForm #prdDiscountPercentage').val();
      data.Taxable = $('#newProductForm #prdTaxPercentage').val();
      if(data.DiscountPercentage > 0){
        data.DiscountPrice = data.Price - (data.DiscountPercentage * data.Price)/100;
        if(data.Taxable > 0){
          data.DiscountPrice = data.DiscountPrice + (data.DiscountPrice * data.Taxable)/100;
        }
        $('#prdDiscountPrice').val(data.DiscountPrice);
      }else{
        $('#prdDiscountPrice').val('');
      }
    });
    $('#categoryShorting').on('change',function(){
      if($(this).val() <= 0){
        $('ul#sortable li').show();
      }else{
        $('ul#sortable li').hide();
        $('ul#sortable li[data-categoryid="'+$(this).val()+'"]').show();
      }
    });

    $('a[data-imgtype]').on('click', function(){
      var data = {};
      data.ProductId = $(this).parents('#frm_uploadProductImages').find('#imgProductId').val();
      data.ImageType = $(this).attr('data-imgtype');
      $(this).removeClass('text-red').addClass('text-green').text('Removed');
      $(this).parent().siblings().find('img').attr('src','null');
      getAjaxResponse("/removeThumbImage", data ,"POST", resEditSlot);
    });

    $('#editProductSequence').on('click', function(){
        if(confirm("are you sure want to change the Product Display Sequence!")) {
          var obj = [];
          var x = null;
          $('#sortable li').each(function(index, data){
            x = {};
            x.productId = $(data).attr('data-productId');
            x.sequenceId =  index ;
            obj.push(x);
          });
          var data = {};
          data.SequenceArray = obj;
          getAjaxResponse("/changeProductSequence", data ,"POST", resEditSlot);
        } else {
          console.log('you cancelled');
        }
    });
    /*table js*/
    $('#example0 ,#example1 , #example2 , #example3, #example4, #example5').DataTable({
       'lengthChange': true,
       'searching'   : true,
       'ordering'    : true,
     })
    /*graph report*/
    $('#show_graph_report').on('click', function(){
        if($('#graph_report_year').val() > 0){
          var data ={};
          data.year = $('#graph_report_year').val();
          getAjaxResponse("/getGarphReportYearly", data ,"POST", resShowGraphData);
        }
    });

    /*Open selected tabs*/
    OpenMeFirst(getStorage('selctedTab'));
    /*daterange picker*/
    $('#daterange-btn').daterangepicker(
      {
        ranges   : {
          'Today'       : [moment(), moment()],
          'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month'  : [moment().startOf('month'), moment().endOf('month')],
          'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(29, 'days'),
        endDate  : moment()
      },
      function (start, end) {
        $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        //console.log(start.format('YYYY-MM-DD 00:00:00'));
        //console.log(end.format('YYYY-MM-DD 23:59:00'));
        var data = {};
        data.StartDate = start.format('YYYY-MM-DD 00:00:00');
        data.EndDate = end.format('YYYY-MM-DD 23:59:00');
        getAjaxResponse("/getDateRangeOrders", data ,"POST", resFilterOrder);
      }
    )
    /*end*/

  })();
});

$(document).ready(function(){
  myCms();
});
