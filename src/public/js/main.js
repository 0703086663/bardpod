
  //=================== ARROW IN INDEX =============================
    $(document).ready(function($) {
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
      $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 1200);
    });

  //==================== MODAL OF Delivery ===========================
  var deliveryModal = document.getElementById("delivery-modal");
  var deliveryBtn = document.getElementById("delivery-btn");
  var deliverySpan = document.getElementsByClassName("delivery-close")[0];
  deliveryBtn.onclick = function() {
    deliveryModal.style.display = "block";
  }
  deliverySpan.onclick = function() {
    deliveryModal.style.display = "none";
  }

  //==================== MODAL OF Payment ===========================
  var paymentModal = document.getElementById("payment-modal");
  var paymentBtn = document.getElementById("payment-btn");
  var paymentSpan = document.getElementsByClassName("payment-close")[0];
  paymentBtn.onclick = function() {
    paymentModal.style.display = "block";
  }
  paymentSpan.onclick = function() {
    paymentModal.style.display = "none";
  }

  //==================== MODAL OF RETURN ===========================
  var returnModal = document.getElementById("return-modal");
  var returnBtn = document.getElementById("return-btn");
  var returnSpan = document.getElementsByClassName("return-close")[0];
  returnBtn.onclick = function() {
    returnModal.style.display = "block";
  }

  returnSpan.onclick = function() {
    returnModal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == paymentModal || event.target == deliveryModal || event.target == returnModal) {
      paymentModal.style.display = "none";
      deliveryModal.style.display = "none";
      returnModal.style.display = "none";
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
