

 $(document).ready(function($) {

  // ====================== Add input field in /admin/pod-table ============================
  var i = 1;
  $(".add-size-btn").click(function() {
    $("#size-fields").append('<div valign="top" class="input-group col-xs-3"><input type="number" class="form-control" id="param-size-number' + i + '" name="size[' + i + '][number]" placeholder="Size number" required /><input type="number" class="form-control input-stock-size" id="param-size-stock' + i + '" name="size[' + i + '][stock]" value="" placeholder="Stock" onkeyup="getTotalStockOfSize()" required/><a href="javascript:void(0);" class="removeSizeBtn btn btn-danger"><i class="fa fa-minus"></i></a></div>');
    i++;
  });
  $("#size-fields").on('click', '.removeSizeBtn', function() {
    $(this).parent().remove();
  });

  //=================== ARROW IN INDEX =============================
    $('.login-section').hide();
    $('#move-to-login-section').click(function(){
        $('.register-sidenav').animate({
            left: '0',
        });
        $('.register-section').animate({
            opacity: 0,
            height: 'hide'
        })
        $('.login-sidenav').animate({
            right: '0',
        });
        $('.login-section').animate({
            height: 'show',
            opacity: 1,
        });
    })

    $('#move-to-register-section').click(function(){
        $('.login-sidenav').animate({
            left: '0',
        });
        $('.login-section').animate({
            opacity: 0,
            height: 'hide'
        })
        $('.register-sidenav').animate({
            left: '60%',
        });
        $('.register-section').animate({
            height: 'show',
            opacity: 1,
        });
    })

    $(window).on('scroll', function() {
      //ADD .TIGHT
      if ($(window).scrollTop() + $(window).height() > $('.wrapper').outerHeight()) {
        $('body').addClass('tight');
        $('.arrow').hide();
      } else {
        $('body').removeClass('tight');
        $('.arrow').show();
      }
    });

    //BACK TO PRESENTATION MODE
    $("html").on("click", "body.tight .wrapper", function() {
      $('html, body').animate({
        scrollTop: $('.wrapper').outerHeight() - $(window).height()
      }, 500);
    });
  });

  $('.arrow').click(function(){
    $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 200);
  });

  $('.btn-info-scroll').click(function(){
    $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 200);
  });

  // ======================== Button to change section ==========================
  $('[data-switch]').on('click', function (e) {
    var $page = $('#pod-sections-index'),
        blockToShow = e.currentTarget.getAttribute('data-switch');
    $('[data-switch]').attr('class','')
    e.currentTarget.setAttribute('class','active');
    // Hide all children.
    $page.children().hide();
    // And show the requested component.
    $page.children(blockToShow).show();
  });

  // ======================== Button to change section SIZE GUIDE /pod/:id ==========================
  $('[data-switch]').on('click', function (e) {
    var $page = $('#pod-size-pages'),
        blockToShow = e.currentTarget.getAttribute('data-switch');
    $('[data-switch]').attr('class','')
    e.currentTarget.setAttribute('class','active');
    $page.children().hide();
    $page.children(blockToShow).show();
  });


//==================== MODAL OF Delivery ===========================
var deliveryModal = document.getElementById("delivery-modal");
var deliveryBtn = document.getElementById("delivery-btn");
var deliverySpan = document.getElementsByClassName("delivery-close")[0];
if(deliveryBtn){
  deliveryBtn.onclick = function() {
    deliveryModal.style.display = "block";
  }
  deliverySpan.onclick = function() {
    deliveryModal.style.display = "none";
  }
}

//==================== MODAL OF Payment ===========================
var paymentModal = document.getElementById("payment-modal");
var paymentBtn = document.getElementById("payment-btn");
var paymentSpan = document.getElementsByClassName("payment-close")[0];
if(paymentBtn){
  paymentBtn.onclick = function() {
    paymentModal.style.display = "block";
  }
  paymentSpan.onclick = function() {
    paymentModal.style.display = "none";
  }
}

//==================== MODAL OF RETURN ===========================
var returnModal = document.getElementById("return-modal");
var returnBtn = document.getElementById("return-btn");
var returnSpan = document.getElementsByClassName("return-close")[0];

if(returnBtn){
  returnBtn.onclick = function() {
    returnModal.style.display = "block";
  }

  returnSpan.onclick = function() {
    returnModal.style.display = "none";
  }
}


// ============== MODAL OF SIZE GUIDE ==================================
var sizeGuideModal = document.getElementById('size-guide-modal');
var sizeGuideBtn = document.getElementById('size-guide-btn');
var sizeGuideSpan = document.getElementsByClassName("size-guide-close")[0];

if(sizeGuideModal){
  sizeGuideBtn.onclick = function() {
    sizeGuideModal.style.display = "block";
  }
  sizeGuideSpan.onclick = function() {
    sizeGuideModal.style.display = "none";
    $('.modal-backdrop').remove();
  }
}

window.onclick = function(event) {
  if (event.target == paymentModal || event.target == deliveryModal || 
      event.target == returnModal || event.target == sizeGuideModal) {
    paymentModal.style.display = "none";
    deliveryModal.style.display = "none";
    returnModal.style.display = "none";
    sizeGuideModal.style.display = "none";
  }
}

//==================== COPY PAYMENT NUMBER ID =================
function CopyToClipboard(id){
  var r = document.createRange();
  r.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

// Toggle between adding and removing the "responsive" class to main-header when the user clicks on the icon 
function openNavResponsive() {
  var x = document.getElementById("main-header");
  if (x.className === "main-header") {
    x.className += " responsive";
  } else {
    x.className = "main-header";
  }
}

//=================== SET TOKEN FROM LOGIN =============================
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function login(){
  $.ajax({
      url: '/login',
      type: 'post',
      data: {
          username: $('#username').val(),
          password: $('#password').val(),
      },
      msg: ''
  })
  .then(data => {
      if (data.success) {
          setCookie('token', data.token, 1);
          window.location.href = "/"
      } else {
          // alert('ajax error:' + data.msg)
          window.location.href = "/login"
      }
  })
  .catch(err => {
      console.log(err)
  })
}

function logout() {
  $.ajax({
      url: '/logout',
      type: 'post',
  })
  .then(data => {
      document.cookie = data +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = "/login"
  })
  .catch(err => {
      console.log(err)
  })
}


// Show the total quantity from stocks /admin/pod-table
// function getTotalStockOfSize(){
//   var arr = document.getElementsByClassName('input-stock-size');
//     var total=0;
//     for(var i=0;i<arr.length;i++){
//         if(parseInt(arr[i].value))
//             total += parseInt(arr[i].value);
//     }
//     $('#size-input').html('<label for="pod-quantity" class="col-form-label">Total Quantity Of Pod: <b id="total">'+total+'</b></label><input hidden id="edit-pod-quantity" name="quantity" value="'+total+'">')
// }

//=================== /admin/product-table ================================
//WHEN HTML DOM is loaded, Delete product confirm shows
  document.addEventListener('DOMContentLoaded', function(){
      var productId;
      var deleteProductForm = document.forms['delete-product-form'];
      var restoreForm = document.forms['restore-product-form'];

      $('#delete-product').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          productId = button.data('id')
      })

      //When delete product btn clicked
      var btnDeleteCategory = document.getElementById('btn-delete-product')
      if(btnDeleteCategory){
        btnDeleteCategory.onclick = function(){
          deleteProductForm.action = '/product/' + productId + '?_method=DELETE';
          deleteProductForm.submit();
        }
      }

      //When button delete clicked
      $('#delete-product').on('show.bs.modal', function (product) {
        var button = $(product.relatedTarget)
        productId = button.data('id')
        })
        var btnDeleteProduct = document.getElementById('btn-delete-product')
        if (btnDeleteProduct){
          btnDeleteProduct.onclick = function(){
            deleteProductForm.action = '/product/' + productId + '/force?_method=DELETE';
            deleteProductForm.submit();
          }
        }
        //When button restore clicked
        $('#restore-product').on('show.bs.modal', function (product) {
        var button = $(product.relatedTarget)
        productId = button.data('id')
        })
        var btnRestoreProduct = document.getElementById('btn-restore-product')
        if (btnRestoreProduct){
          btnRestoreProduct.onclick = function(){
            restoreForm.action = '/product/' + productId + '/restore?_method=PATCH';
            restoreForm.submit();
          }
        }

//=================== /admin/brand-table ================================
        //Delete brand
        var brandId;
        var deleteBrandForm = document.forms['delete-brand-form'];

        $('#delete-brand').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          brandId = button.data('id')
        })

        //When delete brand btn clicked
        var btnDeleteCategory = document.getElementById('btn-delete-brand')
        if(btnDeleteCategory){
          btnDeleteCategory.onclick = function(){
            deleteBrandForm.action = '/brand/' + brandId + '?_method=DELETE';
            deleteBrandForm.submit();
          }
        }

        // Get ID of brand to modal for editing
        $(document).on("click", ".open-modal-edit-brand", function () {
        var brandId = $(this).data('id');
        var brandName = $('#' + brandId + '-name').text();
        var brandDesc = $('#' + brandId + '-desc').text();
        // var brandImage = document.getElementById(brandId + '-image').getAttribute('alt')

        $('#edit-brand-name').attr('value', brandName);
        document.getElementById('edit-brand-desc').value = brandDesc;
        document.getElementById('editBrandLabel').innerHTML = 'Edit brand <b> '+brandName+'</b>';
        // document.getElementById('edit-brand-image').value = brandImage;
          
        var btnEditBrand = document.getElementById('btn-edit-brand')
        var editBrandForm = document.forms['edit-brand-form'];
        btnEditBrand.onclick = function(){
            editBrandForm.action = '/brand/' + brandId + '?_method=PUT';
            editBrandForm.submit();
        }
      });
        
//================== /admin/brand-deleted-table ==========================
        //Restore brand
        var brandDeletedId;
        var restoreBrandForm = document.forms['restore-brand-form']
        $('#restore-brand').on('show.bs.modal', function (brand) {
          var button = $(brand.relatedTarget)
          brandDeletedId = button.data('id')
          })
          var btnRestoreBrand = document.getElementById('btn-restore-brand')
          if (btnRestoreBrand){
            btnRestoreBrand.onclick = function(){
              restoreBrandForm.action = '/brand/' + brandDeletedId + '/restore?_method=PATCH';
              restoreBrandForm.submit();
            }
          }
          
          //Permently delete brand
          var forceDeleteBrandForm = document.forms['permantly-delete-brand-form']
          $('#force-delete-brand').on('show.bs.modal', function (brand) {
            var button = $(brand.relatedTarget)
            brandDeletedId = button.data('id')
            })
            var btnForceDeleteBrand = document.getElementById('btn-force-delete-brand')
            if (btnForceDeleteBrand){
              btnForceDeleteBrand.onclick = function(){
                forceDeleteBrandForm.action = '/brand/' + brandDeletedId + '/force?_method=DELETE';
                forceDeleteBrandForm.submit();
              }
            }
  

// ====================== CRUD /admin/podtype-table =====================
    //Delete podtype
    var podtypeId;
    var deletePodtypeForm = document.forms['delete-podtype-form'];

    $('#delete-podtype').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      podtypeId = button.data('id')
    })

    //When delete podtype btn clicked
    var btnDeleteCategory = document.getElementById('btn-delete-podtype')
    if(btnDeleteCategory){
      btnDeleteCategory.onclick = function(){
        deletePodtypeForm.action = '/podtype/' + podtypeId + '?_method=DELETE';
        deletePodtypeForm.submit();
      }
    }

    // Get ID of podtype to modal for editing
    $(document).on("click", ".open-modal-edit-podtype", function () {
    var podtypeId = $(this).data('id');
    var podtypeName = $('#' + podtypeId + '-name').text();
    // var podtypeImage = document.getElementById(podtypeId + '-image').getAttribute('src')

    $('#edit-podtype-name').attr('value', podtypeName);
    document.getElementById('editPodtypeLabel').innerHTML = 'Edit podtype <b> '+podtypeName+'</b>';
    // document.getElementById('edit-podtype-image').value = podtypeImage;

    var btnEditPodtype = document.getElementById('btn-edit-podtype')
    var editPodtypeForm = document.forms['edit-podtype-form'];
    btnEditPodtype.onclick = function(){
        editPodtypeForm.action = '/podtype/' + podtypeId + '?_method=PUT';
        editPodtypeForm.submit();
    }
  });
    
//================== /admin/podtype-deleted-table ==========================
    //Restore podtype
    var podtypeDeletedId;
    var restorePodtypeForm = document.forms['restore-podtype-form']
    $('#restore-podtype').on('show.bs.modal', function (podtype) {
      var button = $(podtype.relatedTarget)
      podtypeDeletedId = button.data('id')
      })
      var btnRestorePodtype = document.getElementById('btn-restore-podtype')
      if (btnRestorePodtype){
        btnRestorePodtype.onclick = function(){
          restorePodtypeForm.action = '/podtype/' + podtypeDeletedId + '/restore?_method=PATCH';
          restorePodtypeForm.submit();
        }
      }
      
      //Permently delete podtype
      var forceDeletePodtypeForm = document.forms['permantly-delete-podtype-form']
      $('#force-delete-podtype').on('show.bs.modal', function (podtype) {
        var button = $(podtype.relatedTarget)
        podtypeDeletedId = button.data('id')
        })
        var btnForceDeletePodtype = document.getElementById('btn-force-delete-podtype')
        if (btnForceDeletePodtype){
          btnForceDeletePodtype.onclick = function(){
            forceDeletePodtypeForm.action = '/podtype/' + podtypeDeletedId + '/force?_method=DELETE';
            forceDeletePodtypeForm.submit();
          }
        }

// ====================== CRUD /admin/pod-table =====================
    //Delete pod
    var podId;
    var deletePodForm = document.forms['delete-pod-form'];

    $('#delete-pod').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      podId = button.data('id')
    })

    //When delete pod btn clicked
    var btnDeleteCategory = document.getElementById('btn-delete-pod')
    if(btnDeleteCategory){
      btnDeleteCategory.onclick = function(){
        deletePodForm.action = '/pod/' + podId + '?_method=DELETE';
        deletePodForm.submit();
      }
    }

    // Get ID of pod to modal for editing
    $(document).on("click", ".open-modal-edit-pod", function () {
      var podId = $(this).data('id');
      var podImage = document.getElementById(podId + '-image').getAttribute('src')
          podBrandName = $('#' + podId + '-brand-name').text(),
          podTypeName = $('#' + podId + '-type-name').text(),
          podName = $('#' + podId + '-name').text(),
          podColor = $('#' + podId + '-color').text(),
          podPrice = $('#' + podId + '-price').text(),
          podBuff = $('#' + podId + '-buff').text(),
          // podQuantity = $('#' + podId + '-quantity').text(),
          podAvailable = $('#' + podId + '-available').text(),
          podBestseller = $('#' + podId + '-bestseller').text(),
          podBuff = $('#' + podId + '-buff').text();

      document.getElementById('editPodLabel').innerHTML = 'Edit pod <b> '+podName+'</b>';
      $('#preview-image-edit').attr('src', podImage);

      var editBrandOptions = document.getElementsByClassName('edit-brand-options');
      for(var i=0; i<editBrandOptions.length; i++){
        if(editBrandOptions[i].innerHTML == podBrandName){
          var selectedOptions = editBrandOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var editTypeOptions = document.getElementsByClassName('edit-type-options');
      for(var i=0; i<editTypeOptions.length; i++){
        if(editTypeOptions[i].innerHTML == podTypeName){
          var selectedOptions = editTypeOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      $('#edit-pod-name').attr('value', podName);
      
      var editBuffOptions = document.getElementsByClassName('edit-color-options');
      for(var i=0; i<editBuffOptions.length; i++){
        if(editBuffOptions[i].value == podColor){
          var selectedOptions = editBuffOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var editColorOptions = document.getElementsByClassName('edit-color-options');
      for(var i=0; i<editColorOptions.length; i++){
        if(editColorOptions[i].value == podColor){
          var selectedOptions = editColorOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      $('#edit-pod-price').attr('value', podPrice);
      document.getElementById('total').innerHTML = podQuantity;
      
      var editAvailableOptions = document.getElementsByClassName('edit-buff-options');
      for(var i=0; i<editAvailableOptions.length; i++){
        if(editAvailableOptions[i].value == podBuff){
          var selectedOptions = editAvailableOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }
      
      var editBestsellerOptions = document.getElementsByClassName('edit-bestseller-options');
      for(var i=0; i<editBestsellerOptions.length; i++){
        if(editBestsellerOptions[i].value == podBestseller){
          var selectedOptions = editBestsellerOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var btnEditPod = document.getElementById('btn-edit-pod')
      var editPodForm = document.forms['edit-pod-form'];
      btnEditPod.onclick = function(){
          editPodForm.action = '/pod/' + podId + '?_method=PUT';
          editPodForm.submit();
      }
  });
    
//================== /admin/pod-deleted-table ==========================
    //Restore pod
    var podDeletedId;
    var restorePodForm = document.forms['restore-pod-form']

    $('#restore-pod').on('show.bs.modal', function (pod) {
      var button = $(pod.relatedTarget)
      podDeletedId = button.data('id')
    })
    var btnRestorePod = document.getElementById('btn-restore-pod')
    if (btnRestorePod){
      btnRestorePod.onclick = function(){
        restorePodForm.action = '/pod/' + podDeletedId + '/restore?_method=PATCH';
        restorePodForm.submit();
      }
    }
      
    //Permently delete pod
    var forceDeletePodForm = document.forms['permantly-delete-pod-form']
    $('#force-delete-pod').on('show.bs.modal', function (pod) {
      var button = $(pod.relatedTarget)
      podDeletedId = button.data('id')
    })
    var btnForceDeletePod = document.getElementById('btn-force-delete-pod')
    if (btnForceDeletePod){
      btnForceDeletePod.onclick = function(){
        forceDeletePodForm.action = '/pod/' + podDeletedId + '/force?_method=DELETE';
        forceDeletePodForm.submit();
      }
    }
    
// ================= /pod/:id =============================
  // ================= OPEN UL LI SHOE DETAIL =========
  $('.nav-list-items').on('click', function() {
    $('.nav-list-items').not(this).find('div').hide();
    $('.nav-list-items').not(this).find('i').attr('class', 'fa fa-plus');
    $(this).find('div').slideToggle('normal', function() {
      $(this).parent().find('i').toggleClass('fa-minus fa-plus');
    });
  });

    //================= OPEN MODAL BY ELEMENT 'a' /pod/:id=================
    var hrefAPodDetail = document.getElementById("href-a-pod-detail")
    if(hrefAPodDetail){
      hrefAPodDetail.onclick = function() {
        returnModal.style.display = "block";
      }
    }

    var moreDetail = document.getElementById("more-detail")
    if(moreDetail){
      moreDetail.onclick = function() {
        deliveryModal.style.display = "block";
      }
    }
})

//==================== DISPLAY ICON FOR NAVBAR RESPONSIVE =================
$('.icon-responsive').on('click', function() {
  if(document.getElementById('navbar-dropdown-items').getAttribute('style')){
    document.getElementById('navbar-dropdown-items').removeAttribute('style');
    document.getElementById('icon-nav-responsive').setAttribute('class', 'fa fa-bars')
  }
  else{
    $('#navbar-dropdown-items').attr('style', 'display: block');
    document.getElementById('icon-nav-responsive').setAttribute('class', 'fa fa-times')
  }
})


//==================== HEADER SCROLL DOWN =================
$(window).scroll(function() {    
  var scroll = $(window).scrollTop();
  if (scroll >= 5) {
      $(".main-header").addClass("header-sticky");
  }
  else {
    $(".main-header").removeClass("header-sticky");
  }
});

$(".main-header").hover(function(){
  $(this).attr('style','background: var(--clr2);box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);');
  }, function(){
  $(this).attr('style','')
});

// ================ OPEN UL LI SHOE FILTER =========
  $('.filter-pod-btn').on('click', function() {
    $(this).parent().find('ul').slideToggle('normal', function() {
      $(this).parent().find('i').toggleClass('fa-minus fa-plus');
    });
    $('.filter-pod-btn').not(this).find('ul').hide();
  });

  // Responsive UL LI filter
  $("[select-item]").click(function () {
    $("#" + $(this).attr("select-item")).slideToggle('normal').toggleClass("selected");
  });


