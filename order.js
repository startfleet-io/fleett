// all variables

 var step = 1;
    var plans;
    var data = {}
    var stateFee = 0;
    var dt;
    var totalMembers = 1;
    var products;
    var convettePrice = 0;
    var frigatePrice = 0;
    var cruiserPrice = 0; 
    var addonPrice = 0;
    var totalCost =0;
    var suffix = {
      llc:[
        'LLC',
        'L.L.C.',
        'Limited Liability Company'
      ],
      corporation:[
        'Corporation',
        'Incorporated',
        'Inc.',
        'Corp.'
      ]
    };

// get pricing

function getPricing() {

$.get(`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/pricing`,{},async function(data, textStatus, jqXHR) {

    plans = data.plans;
    dt = data.state_fess;
    products = data.products

    let x = plans.filter((item)=> item.name.toLowerCase() == "corvette")
    let y = plans.filter((item)=> item.name.toLowerCase() == "frigate")
    let z = plans.filter((item)=> item.name.toLowerCase() == "cruiser")

    convettePrice = x[0].price
    $("#convettePrice").html(`$${x[0].price}`);

    frigatePrice = y[0].price
    $("#frigatePrice").html(`$${y[0].price}`);

    cruiserPrice = z[0].price
    $("#cruiserPrice").html(`$${z[0].price}`);
   
    // initialise
    init();


});

}

// call getPricing
getPricing()


// step validation

function stepValidation() {

  let divStep = $(`.custom-step-${step}`);
    if(divStep.length) {

          if(step  == 1) {

            let stateElements = divStep
            .find("div.wrapper-state")
            .find("input:checked");

            let structureElements = divStep
            .find("div.wrapper-structure")
            .find("input:checked");

            if(!stateElements.length) {

              let msg = '<div class="invalid-insert show-left">'
              msg+='Please choose state!'
              msg+='</div>'
              divStep
              .find("div.wrapper-state")
              .next("div.invalid-insert")
              .remove();

              divStep
              .find("div.wrapper-state")
              .after(msg);

              return false;
            }else {

              divStep
              .find("div.wrapper-state")
              .next("div.invalid-insert")
              .remove();

            }

            if(!structureElements.length) {

              let msg = '<div class="invalid-insert show-left">'
              msg+='Please choose structure!'
              msg+='</div>'
              divStep
              .find("div.wrapper-structure")
              .next("div.invalid-insert")
              .remove();

              divStep
              .find("div.wrapper-structure")
              .after(msg);

              return false;

            }else {
              divStep
              .find("div.wrapper-structure")
              .next("div.invalid-insert")
              .remove();
            }

            data.state = stateElements.attr("data-value")
            data.structure = structureElements.attr("data-value")
            localStorage.setItem('data', JSON.stringify(data));
            
            callStateFee(data);
            return true;
            
          }

          if(step == 2) {

             let planElements = divStep
            .find("div.custom-grid-pricing-step-2")
            .find("input:checked");

            if(!planElements.length) {

              let msg = '<div class="invalid-insert show-left">'
              msg+='Please choose plan!'
              msg+='</div>'
              divStep
              .find("div.custom-grid-pricing-step-2")
              .next("div.invalid-insert")
              .remove();

              divStep
              .find("div.custom-grid-pricing-step-2")
              .after(msg);

              return false;

            }else {

              divStep
              .find("div.custom-grid-pricing-step-2")
              .next("div.invalid-insert")
              .remove();

              return true;
            }
          }

          if(step == 3) {
           
            if(($("#Company-name-2").val()).trim() == '') {
              let msg = '<div class="invalid-insert show-left">'
              msg+='Please enter company name!'
              msg+='</div>'

              $("#Company-name-2")
              .next("div.invalid-insert")
              .remove();

               $("#Company-name-2")
               .after(msg);

              return false;
            }

            $("#Company-name-2")
              .next("div.invalid-insert")
              .remove();

            if(($("#SSN-or-ITIN-2").val()).trim() == '') {
              let msg = '<div class="invalid-insert show-left">'
              msg+='Please choose suffix!'
              msg+='</div>'

              $("#SSN-or-ITIN-2")
              .next("div.invalid-insert")
              .remove();

               $("#SSN-or-ITIN-2")
               .after(msg);
              return false;
            }

             $("#SSN-or-ITIN-2")
              .next("div.invalid-insert")
              .remove();

            if(($("#Business-desc-form").val()).trim() == '') {

              let msg = '<div class="invalid-insert show-left">'
              msg+='Please enter business description!'
              msg+='</div>'

              $("#Business-desc-form")
              .next("div.invalid-insert")
              .remove();

               $("#Business-desc-form")
               .after(msg);

              return false;

            }

            $("#Business-desc-form")
              .next("div.invalid-insert")
              .remove();

            if((($("#Business-desc-form").val()).trim()).length < 20) {

              let msg = '<div class="invalid-insert show-left">'
              msg+='Please business description at least 20 characters long!'
              msg+='</div>'

              $("#Business-desc-form")
              .next("div.invalid-insert")
              .remove();

               $("#Business-desc-form")
               .after(msg);

              return false;
            }

             $("#Business-desc-form")
              .next("div.invalid-insert")
              .remove();

            let data = localStorage.getItem('data');
            data = JSON.parse(data);
            data.companyName = ($("#Company-name-2").val()).trim()
            data.SSN = ($("#SSN-or-ITIN-2").val()).trim()
            data.businessDescription = ($("#Business-desc-form").val()).trim()
            data.members = totalMembers
            localStorage.setItem("data", JSON.stringify(data));
            return true;

          }
    }
}



// make single selection state
$("div.wrapper-state .checkbox-wrap").click(function(){

  let divStep = $(`.custom-step-${step}`);
  let checkboxes = divStep
            .find("div.wrapper-state").find("input[type='checkbox']")

  checkboxes.each(function() {
    $(this).prev("div.w-checkbox-input").removeClass("w--redirected-checked")
    $(this).prop("checked",false);
  })

  let url = new URL(window.location.href);
  let search_params = url.searchParams;
  search_params.set('cct',$(this).next().next().attr("data-value"))

  if (history.pushState) {
    window.history.pushState({path:url.href},'',url.href);
  }

  let stateElements = divStep
            .find("div.wrapper-state")
            .find("input:checked");
})

// make single selection structure

$("div.wrapper-structure .checkbox-wrap").on("click",function(){

  let divStep = $(`.custom-step-${step}`);

  let checkboxes = divStep
            .find("div.wrapper-structure")
            .find("input[type='checkbox']")

  let url = new URL(window.location.href);
  let search_params = url.searchParams;
  let selectedStructure = $(this).next().next().attr("data-value");

  search_params.set('ct',selectedStructure)
    if (history.pushState) {
    window.history.pushState({path:url.href},'',url.href);
      changeSuffixOptions(selectedStructure)
    }

  checkboxes.each(function() {
    $(this).prev("div.w-checkbox-input")
    .removeClass("w--redirected-checked")
    $(this).prop("checked",false);
  })

})

// make single selection plan

$("div.custom-grid-pricing-step-2 .checkbox-wrap").on("click",function(){

  let divStep = $(`.custom-step-${step}`);

  let checkboxes = divStep
            .find("div.custom-grid-pricing-step-2")
            .find("input[type='checkbox']")

  checkboxes.each(function() {
    $(this).prev("div.w-checkbox-input").removeClass("w--redirected-checked")
    $(this).prop("checked",false);
  })

  let selectedPlan = $(this).next().next();
  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('p',selectedPlan.attr("data-value"))

    if (history.pushState) {

    window.history.pushState({path:url.href},'',url.href);
  }

  let data = JSON.parse(localStorage.getItem('data'));

  data.plan = selectedPlan.attr("data-value")
  localStorage.setItem('data', JSON.stringify(data));
  callTotalFee();

})


function changeSuffixOptions( structure ) {

  let strLower = structure.toLowerCase();
  let options = suffix[strLower];

  if(options.length) {
    let suffId = $("#SSN-or-ITIN-2");
    suffId.empty()
    suffId.append(`<option value="">Select</option>`)
    options.forEach(function(opt) {
      suffId.append(`<option value="${opt}">${opt}</option>`)
    })
  }

}



function callStateFee( data ) {
  
  const { state ,structure} = data;
  let found = dt.find(function (elm) {
      return (
        elm.structure.toLowerCase() == structure &&
        elm.state.toLowerCase() == state
      );
    });

  if(found) {

    $("#stateText").html(`${found.state.charAt(0).toUpperCase()}${found.state.slice(1)} State Fees`)
    stateFee = found.fee;
    $("#stateFee").html(`$${stateFee}`)
    //$("#totalCost").html(`$${stateFee}`);
  }
}

function callTotalFee() {

let p = JSON.parse(localStorage.getItem("data"));
let x = plans.filter((item)=> item.name.toLowerCase() == p.plan)[0]
   console.warn(`state fee ${stateFee}`);

 totalCost = parseInt(stateFee) + parseInt(x.price);
 if(addonPrice) {
  totalCost+=parseInt(addonPrice);
 }

$("#totalCost").html(`$${totalCost}`);

}

// make single selection
$("div.wrapper-option-member-step-3 label.w-checkbox").click(function() {

  var action = $(this).find("input[type='checkbox']").is(":checked");
  if($(this).prevAll('label.w-checkbox').length <=0) {

     $(this).find("div.w-checkbox-input").addClass("w--redirected-checked")
      $(this).find("input[type='checkbox']").prop("checked",true);

  }

  $(this).prevAll('label.w-checkbox').each(function() {

    if(action) {
      $(this).find("div.w-checkbox-input").addClass("w--redirected-checked")
      $(this).find("input[type='checkbox']").prop("checked",true);
    }

  })

  $(this).nextAll('label.w-checkbox').each(function() {

    if(!action) {
      $(this).find("div.w-checkbox-input").removeClass("w--redirected-checked")
      $(this).find("input[type='checkbox']").prop("checked",false);
    }
    
  })

   let divStep = $(`.custom-step-${step}`);

    let checkboxes = divStep
             .find("div.wrapper-option-member-step-3").find("input:checked")
   let newMembers = parseInt(checkboxes.length);
   totalMembers = newMembers
   $("#totalMembers").html(`${newMembers}`);

   if(newMembers > 1) {
      $("#memberText").html("Members")
   }else {
      $("#memberText").html("Member")
   }
})

$(document).on("click",".custom-submit",function() {
  finalSubmission();
})

// final submission
function finalSubmission() {

//e.preventDefault();

 if(step == 4) {


    if(($("#Full-name").val()).trim() == '') {

      let msg = '<div class="invalid-insert show-left">'
      msg+='Please enter full name!'
      msg+='</div>'

      $("#Full-name").next("div.invalid-insert").remove();

       $("#Full-name").after(msg);
      return false;

    }
    $("#Full-name").next("div.invalid-insert").remove();

    if(($("#Email-field").val()).trim() == '') {

      let msg = '<div class="invalid-insert show-left">'
      msg+='Please valid email!'
      msg+='</div>'
      $("#Email-field").next("div.invalid-insert").remove();
       $("#Email-field").after(msg);
      return false;

    }
     $("#Email-field").next("div.invalid-insert").remove();

     if(($("#phone").val()).trim() == '') {

      let msg = '<div class="invalid-insert show-left extra-margin">'
      msg+='Please valid phone number!'
      msg+='</div>'
      $("#phone").next("div.invalid-insert").remove();
       $("#phone").after(msg);
      return false;

    }

    $("#phone").next("div.invalid-insert").remove();

    if(($("#SSN-or-ITIN").val()).trim() == '') {

      let msg = '<div class="invalid-insert show-left">'
      msg+='Please choose!'
      msg+='</div>'
      $("#SSN-or-ITIN").next("div.invalid-insert").remove();
       $("#SSN-or-ITIN").after(msg);
      return false;

    }
     $("#SSN-or-ITIN").next("div.invalid-insert").remove();

     if(!$("#error-msg").hasClass("hide")) {

      return false;
     }


     let data = localStorage.getItem('data');
            data = JSON.parse(data);
            data.cName = ($("#Full-name").val()).trim()
            data.cEmail = ($("#Email-field").val()).trim()
            data.SSNYN = ($("#SSN-or-ITIN").val()).trim()
            data.cPhone = ($("#phone").val()).trim()
            data.members = totalMembers
            localStorage.setItem("data", JSON.stringify(data));

            alert(localStorage.getItem('data'));
            console.log(data);

  }

    console.log('finsal submission')


}

// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


// initialize function
function init() {

 var plan        = getParameterByName('p'); // "plan"
 var companyType = getParameterByName('ct'); // "company type"
 var companyCity = getParameterByName('cct'); // "company city"
 var refcodes = getParameterByName('ref'); // "refcodes"
 
 if(!plan && !companyType && !companyCity && !refcodes) {

  let storage = localStorage.getItem('data');
  if(storage) {
    let data = JSON.parse(storage);

    let url = new URL(window.location.href);
    let search_params = url.searchParams;
    search_params.set('p',data.plan)
    search_params.set('ct',data.structure)
    search_params.set('cct',data.state)
    search_params.set('ref',data.refcodes)

    if (history.pushState) {

      window.history.pushState({path:url.href},'',url.href);
      window.location = window.location;
    }
  }
 }

let divStep = $(`.custom-step-${step}`);

  let stateCheckboxes = divStep
            .find("div.wrapper-state").find("input[type='checkbox']")

  
  let structureCheckboxes = divStep
            .find("div.wrapper-structure").find("input[type='checkbox']")

 if(companyCity) {
  stateCheckboxes.each(function() {
    if($(this).attr("data-value").toLowerCase() == companyCity.toLowerCase()) {

            $(this).prev().addClass("w--redirected-checked")
            $(this).prop("checked",true);
            data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {};
            data.state = $(this).attr("data-value")
            localStorage.setItem('data', JSON.stringify(data));
            callStateFee(data);
    }
  })
}

  if(companyType) {
  structureCheckboxes.each(function() {
    if($(this).attr("data-value").toLowerCase() == companyType.toLowerCase()) {

      $(this).prev().addClass("w--redirected-checked")
      $(this).prop("checked",true);
       data = JSON.parse(localStorage.getItem('data'));
       data.structure = $(this).attr("data-value")
       localStorage.setItem('data', JSON.stringify(data));
        changeSuffixOptions(data.structure)
    }
  })
}

 

 let planScreen = $(`.custom-step-2`);

 let planCheckboxes = planScreen
            .find("div.custom-grid-pricing-step-2").find("input[type='checkbox']")
if(plan) {
  planCheckboxes.each(function() {
    if($(this).attr("data-value").toLowerCase() == plan.toLowerCase()) {

      $(this).prev().addClass("w--redirected-checked")
      $(this).prop("checked",true);
       let data = JSON.parse(localStorage.getItem('data'));
       data.plan = $(this).attr("data-value")
       localStorage.setItem('data', JSON.stringify(data));
          callTotalFee();
       
    }
  })
}

 if(refcodes) {

   let codes = refcodes.split("-")
   let choosenProducts = []
   if(codes.length) {
     
     let data = JSON.parse(localStorage.getItem('data'));
     data.refcodes = refcodes;
     localStorage.setItem('data', JSON.stringify(data));

     codes.forEach((co)=>{
        choosenProducts.push(products.filter((prod)=> prod.refcode == co )[0])
     })
  }

   if(choosenProducts.length) {

   

    let addonsString = `<div class="item-total-pricing-step-2 custom-padding-item-total-price-step-2 addons-pricing">
                          <div class="title-item-card-list">Add ons:</div>
                          <div class="subtotal-item-card-list">
                            <div class="number-subtotal-item-list">$???</div>
                          </div>
                        </div>`;



    choosenProducts.forEach((cp)=>{
      addonsString+=`<div class="item-total-pricing-step-2 custom-padding-item-total-price-step-2 add-ons-item-pricing">
      <div class="title-item-card-list custom-weight-title-item-card-list">${cp.name}</div>
      <div class="subtotal-item-card-list">
      <div class="number-subtotal-item-list custom-weight-title-item-card-list">${cp[plan+'_price']}</div>
      </div>
      </div>`;
      addonPrice+=parseInt(cp[plan+'_price']);
    })

    addonsString = addonsString.replace('???',addonPrice);

    $(".total-pricing-card > div:nth-child(1)").after(addonsString);
    totalCost+=addonPrice;
    $("#totalCost").html(`$${totalCost}`)
   }
   
 }

}

// phone field

var input = document.querySelector("#phone"),
  dialCode = document.querySelector(".dialCode"),
  errorMsg = document.querySelector("#error-msg"),
    validMsg = document.querySelector("#valid-msg");
var iti = intlTelInput(input, {
  initialCountry: "us",
  placeholderNumberType: 'FIXED_LINE',
});
var tempCode = '';
var updateInputValue = function (event) {

        let code = iti.getSelectedCountryData().dialCode;
        let inptValue = input.value
        inptValue = inptValue.replace('+','');
        if(tempCode != code) {

         inptValue = inptValue.replace(tempCode,'');
        }else {
          inptValue = inptValue.replace(code,'');
        }
        tempCode = code
        input.value = `+${code}${inptValue}`;
};

var updateSelectValue = function (event) {

        tempCode = iti.getSelectedCountryData().dialCode;
};

input.addEventListener('input', updateInputValue, false);
input.addEventListener('countrychange', updateSelectValue, false);

var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
var reset = function() {
  input.classList.remove("error");
  errorMsg.innerHTML = "";
  errorMsg.classList.add("hide");
  validMsg.classList.add("hide");
};
input.addEventListener('blur', function() {
  reset();
  if (input.value.trim()) {
    if (iti.isValidNumber()) {
      validMsg.classList.remove("hide");
    } else {
      input.classList.add("error");
      var errorCode = iti.getValidationError();
      errorMsg.innerHTML = errorMap[errorCode];
      errorMsg.classList.remove("hide");
    }
  }
});
input.addEventListener('change', reset);
input.addEventListener('keyup', reset);