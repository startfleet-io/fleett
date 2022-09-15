// all variables

//var city = geotargeto_city()
//var region = geotargeto_region();
//var postalCode = geotargeto_postalCode()
//var countryCode= geotargeto_countryCode()


// getCookie
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// removeCookie

function removeCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

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
    var codes = [];
    var choosenProducts = [];
    var x,y,z;
    var retries = 1;

    var formErrorMsg = '<div class="invalid-insert show-left">';
    formErrorMsg+='###';
    formErrorMsg+='</div>';

    var defaultData = JSON.stringify({});

    var dataName = 'sf_store_database';

    var API_BASE = `https://xe5a-injf-5wxp.n7.xano.io`;


    //  const API_PRICING = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/pricing`;
    var API_PRICING = ``;

    // const API_EMAIL_VALIDATION =`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/check-email`;
    var API_EMAIL_VALIDATION =``;

    //const API_PHONE_VALIDATION = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/check-phone`
    var API_PHONE_VALIDATION = ``

    //const API_ORDER = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/order`
    var API_ORDER = ``

   
    var isEmailTrue = true;
    var isPhoneTrue = true;

    var byPassStep3 = false;
    var byPassStep2 = false;

    const plan_level_one = "Freelancer" // old one corvette
    const plan_level_two = "Startup" // old frigate
    const plan_level_three = "Business" // old cruiser
    const plan_names = [plan_level_one,plan_level_two,plan_level_three];

    var planIndex = 0;
    var bucketProducts = [];
    var bucketPrice = 0;

    var version,source;

    
function setUpTestEnv() {

     version = getParameterByName('v')
     source  = getParameterByName('source')

    if(version && source) {

      API_VERSION = `:v${version}`;
      API_PRICING = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/pricing`
      API_EMAIL_VALIDATION = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/check-email`
      API_PHONE_VALIDATION = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/check-phone`
      API_ORDER = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/order`

      $.ajaxSetup({
      beforeSend: function (xhr)
      {
       xhr.setRequestHeader("X-Data-Source","test");
      // xhr.setRequestHeader("Authorization","Token token=\"FuHCLyY46\"");        
      }
    });
      
      console.warn('test mode')
    }else {

      API_PRICING = `${API_BASE}/api:z9NOXVAQ/pricing`
      API_EMAIL_VALIDATION = `${API_BASE}/api:z9NOXVAQ/check-email`
      API_PHONE_VALIDATION = `${API_BASE}/api:z9NOXVAQ/check-phone`
      API_ORDER = `${API_BASE}/api:z9NOXVAQ/order`
      
      console.warn('live mode')
    }


  }


// set plan index for mobile

function setPlanIndex( planName ) {

        if(planName.toLowerCase() == 'freelancer'){
          planIndex = 0;
        }else if(planName.toLowerCase() == 'startup') {
          planIndex = 1;
        }else {
           planIndex = 2;
        }
}
// scroll to top

function focusOnTop() {

    $([document.documentElement, document.body]).animate({
        scrollTop: $(".paragraph-11").offset().top
      }, 1000);
    console.warn(planIndex);
    console.log($('.slider-2').find(".w-round").children()[planIndex])
    let els = $('.slider-2').find(".w-round").children();
    els.each(function(indx,el) {
      if(indx == planIndex) {
        console.warn('should tap')
        $(this).trigger( 'tap' )
        return true;
      }

    })
     //$('.slider-2').find(".w-round").children()[planIndex].click()
}

// is mobile

function isMobile() {

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
  }else {
    return false;
  }
}


// set plan names

function setPlanNames() {

    $(".custom-grid-pricing-step-2").children().each(function(index,el) {
        
        let planName = plan_names[index];
        $(this).find(".custom-title-box-card").html(planName)
        $(this).find("input[type='checkbox']").attr("data-value", planName.toLowerCase())

        

    })

}

setPlanNames();

function setStates( dt ) {

   var resArr = [];
   dt.filter(function(item){
     var i = resArr.findIndex(x => (x.state == item.state));
     if(i <= -1 && (item.state!==null && item.is_show === true)){
           resArr.push(item);
     }
     return null;
   });
   console.log(resArr)
   if(resArr.length >= 1) {
      $("#state-list-main-wrap").empty();
      resArr.forEach(function(ite) {

         
         console.log(ite)

       let st =  `<div class="state-list-details-wrap">
         <input type="radio" name="State" data-value="${ite.state}">
         <div class="state-list-details">
         <img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/60f95270749977197e5d4ee7_delaware.svg" loading="lazy" alt="">
         <span>${ite.state.charAt(0).toUpperCase()}${ite.state.slice(1)}</span>      
         </div> 
         </div>`;
         $("#state-list-main-wrap").append(st);


      })
   }

}
// get pricing

function getPricing() {

setUpTestEnv();

$.get(API_PRICING,{},async function(data, textStatus, jqXHR) {

    plans = data.plans;
    dt = data.state_fess;
    products = data.products

    console.log(dt);

     // x = plans.filter((item)=> item.name.toLowerCase() == "corvette")
     // y = plans.filter((item)=> item.name.toLowerCase() == "frigate")
     // z = plans.filter((item)=> item.name.toLowerCase() == "cruiser")

     x = plans.filter((item)=> item.name.toLowerCase() == plan_level_one.toLowerCase())
     y = plans.filter((item)=> item.name.toLowerCase() == plan_level_two.toLowerCase())
     z = plans.filter((item)=> item.name.toLowerCase() == plan_level_three.toLowerCase())

    convettePrice = x[0].price
    $("#convettePrice").html(`$${x[0].price}`);
    $("#mobile-freelancer-top-price").html(`$${x[0].price}`);

    frigatePrice = y[0].price
    $("#frigatePrice").html(`$${y[0].price}`);
    $("#mobile-startup-top-price").html(`$${y[0].price}`);

    cruiserPrice = z[0].price
    $("#cruiserPrice").html(`$${z[0].price}`);
    $("#mobile-business-top-price").html(`$${z[0].price}`);
   
    // initialise
    console.warn("lets init")
    setStates( dt );
    myinit();


});

}

// call getPricing
getPricing()


// step1 validation

function stateValidation( divStep ) {

let stateElements = divStep
            .find("div.wrapper-state")
            .find("input:checked");
//alert(stateElements.length);

if(!stateElements.length) {

      let msg = formErrorMsg;
      msg = msg.replace('###','Please choose state!');

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

       let data = localStorage.getItem(dataName) ? localStorage.getItem(dataName) : defaultData;
        data = JSON.parse(data);
        data.state = stateElements.attr("data-value")
        localStorage.setItem(dataName, JSON.stringify(data));
        return true

    }
}

// step2 validation

function structureValidation( divStep ) {

    let structureElements = divStep
      .find("div.wrapper-structure")
      .find("input:checked");

      if(!structureElements.length) {

        let msg = formErrorMsg
        msg = msg.replace('###','Please choose structure!')
        
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

        let data = localStorage.getItem(dataName) ? localStorage.getItem(dataName) : defaultData;
          data = JSON.parse(data);
          data.structure = structureElements.attr("data-value")
          localStorage.setItem(dataName, JSON.stringify(data));

          return true;
      }
}

// plan validation

function planValidation( divStep ) {

 var planElements;

  if(!isMobile()) {

   planElements = divStep
          .find("div.custom-grid-pricing-step-2")
          .find("input:checked");
  }else {

      planElements = divStep
            .find("div.slider-2")
            .find("input:checked");
  }

    if(!planElements.length) {

      let msg = formErrorMsg.replace('###','Please choose plan!');
      divStep
      .find("div.custom-grid-pricing-step-2")
      .next("div.invalid-insert")
      .remove();

      divStep
      .find("div.custom-grid-pricing-step-2")
      .after(msg);

      return false;

    } else {

      divStep
      .find("div.custom-grid-pricing-step-2")
      .next("div.invalid-insert")
      .remove();

      let data = localStorage.getItem(dataName) ? localStorage.getItem(dataName) : defaultData;
      data = JSON.parse(data);
      data.plan = planElements.attr("data-value")
      let minePlan = plans.filter((p) => p.name.toLowerCase() == data.plan.toLowerCase())
      data.planId = minePlan[0].id
      localStorage.setItem(dataName, JSON.stringify(data));

      return true;
    }

}
// company details validation

function companyDetailsValidation() {


  let pass = true;

  $("#Company-name-2")
      .next("div.invalid-insert")
      .remove();

  if(($("#Company-name-2").val()).trim() == '') {

      let msg = formErrorMsg.replace('###','Please enter company name!')

       $("#Company-name-2")
       .after(msg);
       pass = false
      //return false;
    }

          
     $("#SSN-or-ITIN-2")
      .next("div.invalid-insert")
      .remove();

    if(($("#SSN-or-ITIN-2").val()).trim() == '') {

      let msg = formErrorMsg.replace('###','Please choose suffix!')
       $("#SSN-or-ITIN-2")
       .after(msg);
       pass = false
      //return false;
    }

    //  $("#Business-desc-form")
    //     .next("div.invalid-insert")
    //     .remove();
            

    //   if(($("#Business-desc-form").val()).trim() == '') {

    //      let msg = formErrorMsg.replace('###','Please enter business description!')
    //      $("#Business-desc-form")
    //      .after(msg);
    //      pass = false
    //     //return false;

    //   }

    //   $("#Business-desc-form")
    //     .next("div.invalid-insert")
    //     .remove();

    // if((($("#Business-desc-form").val()).trim()).length < 20) {

    //   let msg = formErrorMsg.replace('###','Please enter business description at least 20 characters long!')
    //    $("#Business-desc-form")
    //    .after(msg);
    //    pass = false
    //    //return false;
    // }

    if(pass) {

    let data = localStorage.getItem(dataName);
    data = JSON.parse(data);
    data.companyName = ($("#Company-name-2").val()).trim()
    data.suffix = ($("#SSN-or-ITIN-2").val()).trim()
    //data.businessDescription = ($("#Business-desc-form").val()).trim()
    data.members = totalMembers
    localStorage.setItem(dataName, JSON.stringify(data));

      return true;
    }
    return false

} 
$(document).on("change","#phone",async function() {

    $("#phone").next("div.invalid-insert").remove();
    return true;
    if(retries >= 2) {
      return true;
    }

    try {

      await validate_phone()
      isPhoneTrue = true;
      retries++

    }catch(err) {

       let msg = formErrorMsg.replace('###','Please enter valid phone number!')
       isPhoneTrue = false;
       $("#phone").after(msg);
       retries++
       return false;
    }

})

$(document).on("change","#Email-field",async function() {

          var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
          
          $("#Email-field").next("div.invalid-insert").remove();

          if(!pattern.test($("#Email-field").val().trim()))
          {
              isEmailTrue =false
              let msg = formErrorMsg.replace('###','Please enter valid email!')
              $("#Email-field").after(msg);
              return false;
          }

          try {
              await validate_email();
               isEmailTrue =true
          }catch( err ) {

             isEmailTrue =false
            let msg = formErrorMsg.replace('###','Please enter valid email!')
            $("#Email-field").after(msg);
            console.log('placing error')
            return false;
         

          }

  //console.log($(this).val())
});

// final step validation
function finalStepValidation() {

return new Promise(async(resolve,reject)=> {

    let pass = true;

    $("#Full-name").next("div.invalid-insert").remove();

    if(($("#Full-name").val()).trim() == '') {
      pass = false
      let msg = formErrorMsg.replace('###','Please enter full name!')
      $("#Full-name").after(msg);
      //return false;

    }

  
    $("#Email-field").next("div.invalid-insert").remove();

    if(($("#Email-field").val()).trim() == '') {
      pass = false
      let msg = formErrorMsg.replace('###','Please enter valid email!')
      $("#Email-field").after(msg);
      //return false;

    }


     // validate email

     if(($("#Email-field").val()).trim() !== '' && !isEmailTrue) {

          var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

          if(!pattern.test($("#Email-field").val().trim()))
          {
              pass = false
              let msg = formErrorMsg.replace('###','Please enter valid email!')
              $("#Email-field").after(msg);
              //return false;
          }


          try {
             await validate_email();
          }catch(err) {

            pass = false
            let msg = formErrorMsg.replace('###','Please enter valid email!')
            $("#Email-field").after(msg);
            //return false;

          }
  

     }


     $("#phone").next("div.invalid-insert").remove();

     if(($("#phone").val()).trim() == '') {
      pass = false
      let msg = formErrorMsg.replace('###','Please enter valid phone number!')
      
       $("#phone").after(msg);
      //return false;

    }

    // validate phone number
    
     if(($("#phone").val()).trim()!=='' && retries < 2 && !isPhoneTrue) {

        try {
          await validate_phone();
        }catch(err) {
          
            pass = false
            let msg = formErrorMsg.replace('###','Please enter valid phone number!')
            $("#phone").after(msg);
              //return false;
        }
        
        retries++

     }

     // new fields validation

    $("#Country-Citizenship").next("div.invalid-insert").remove();

    if(($("#Country-Citizenship").val()).trim() == '') {
      pass = false
      let msg = formErrorMsg.replace('###','Choose a Country')
      $("#Country-Citizenship").after(msg);
      //return false;

    }

    $("#Country-Residence").next("div.invalid-insert").remove();

    if(($("#Country-Residence").val()).trim() == '') {
      pass = false
      let msg = formErrorMsg.replace('###','Choose a Country')
      $("#Country-Residence").after(msg);
      //return false;

    }


     $("#SSN-or-ITIN").next("div.invalid-insert").remove();

      if(($("#SSN-or-ITIN").val()).trim() == '') {
        pass = false
        let msg = formErrorMsg.replace('###','Please choose!')
         $("#SSN-or-ITIN").after(msg);
         //return false;
      }

      $("#terms-agree").next().next("div.invalid-insert").remove();

      if(!$("#terms-agree").is(":checked")) {
        pass = false
        console.warn(`see here`)
        let msg = formErrorMsg.replace("show-left",'s-left');
         msg = msg.replace('###','Please agree!')
         $("#terms-agree").next().after(msg);
         //return false;
      }


     if(!$("#error-msg").hasClass("hide")) {
      pass = false
      //return false;
     }

    if(pass) {
      let data = localStorage.getItem(dataName);
      data = JSON.parse(data);
      data.cName = ($("#Full-name").val()).trim()
      data.cEmail = ($("#Email-field").val()).trim()
      data.SSNYN = ($("#SSN-or-ITIN").val()).trim()
      data.cPhone = ($("#phone").val()).trim()
      data.members = totalMembers
      data.agree = $("#terms-agree").is(":checked") ? 'Yes' : 'No'
      // new fields

      data.country_c = ($("#Country-Citizenship").val()).trim()
      data.country_r = ($("#Country-Residence").val()).trim()

      localStorage.setItem(dataName, JSON.stringify(data));

       resolve(true);
   }else {
      reject(false)
   }
  
   })

}

// step validation

function stepValidation() {

  let divStep = $(`.custom-step-${step}`);
    if(divStep.length) {

          // step 1
          if(step  == 1) {
             let pass = true;
             if(!stateValidation(divStep)) {
              pass = false
              return false;
             }

             if(!structureValidation(divStep)) {
              pass = false
              return false;
             }

             if(pass) {
              let data = localStorage.getItem(dataName) ? localStorage.getItem(dataName) : defaultData;
              data = JSON.parse(data);
              callStateFee(data);
              return true;
             }
             return false; // default return 
          }

          // step 2
          if(step == 2 && !byPassStep2) {

            let pass = true;

            if(!planValidation(divStep)) {

              pass = false;

              return false;

            }

            if(pass) {
                return true;
            }
            return false; // default return 
          }

          // step 3
          if(step == 3 && !byPassStep3) {
           
            let pass =  true;

            if(!companyDetailsValidation()) {
              pass = false
              return false
            }

           if(pass) {
            console.log('step 3 passed')
            onCheckout( 1 );
            return true;
           }

           return false; // default return
            
          }
    }
}



// make single selection state
//$("div.wrapper-state .checkbox-wrap").click(function(){
$(document).on("click", "div.state-list-details-wrap", function(){

  let divStep = $(`.custom-step-${step}`);
  // let checkboxes = divStep
  //           .find("div.wrapper-state").find("input[type='checkbox']")

            let checkboxes = divStep
            .find("div.wrapper-state").find("input[type='radio']")

  checkboxes.each(function() {
   // $(this).prev("div.w-checkbox-input").removeClass("w--redirected-checked")
   // $(this).prop("checked",false);
  })

  let url = new URL(window.location.href);
  let search_params = url.searchParams;
 // search_params.set('cct',$(this).next().next().attr("data-value"))
 console.log($(this).find("input[type='radio']").attr("data-value"))
  search_params.set('cct',$(this).find("input[type='radio']").attr("data-value"))

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
  let choosenProduct = selectedPlan.attr("data-value")
  console.log(choosenProduct)
  let minePlan = plans.filter((p)=> p.name.toLowerCase() == choosenProduct.toLowerCase())[0];

  if(choosenProducts.length) {


      setProductPrices(choosenProduct)

    console.warn(choosenProducts);
  }


  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('p',selectedPlan.attr("data-value"))

    if (history.pushState) {

    window.history.pushState({path:url.href},'',url.href);
  }

  let data = JSON.parse(localStorage.getItem(dataName));

  data.plan = selectedPlan.attr("data-value")
  data.planId = minePlan.id;
  localStorage.setItem(dataName, JSON.stringify(data));
  callTotalFee();

})

// mobile

// make single selection plan

$("div.slider-2 .checkbox-wrap").on("click",function(){

  let divStep = $(`.custom-step-${step}`);

  let checkboxes = divStep
            .find("div.slider-2")
            .find("input[type='checkbox']")
            //console.warn(checkboxes)

  checkboxes.each(function() {
    $(this).prev("div.w-checkbox-input").removeClass("w--redirected-checked")
    $(this).prop("checked",false);
  })

  //console.log($(this));
  //return
  let selectedPlan = $(this).next().next();
  let choosenProduct = selectedPlan.attr("data-value")
  console.log(choosenProduct)
  let minePlan = plans.filter((p)=> p.name.toLowerCase() == choosenProduct.toLowerCase())[0];

       // call setPlanIndex
       setPlanIndex(minePlan.name)

  if(choosenProducts.length) {
      setProductPrices(choosenProduct)
    console.warn(choosenProducts);
  }


  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('p',selectedPlan.attr("data-value"))

    if (history.pushState) {

    window.history.pushState({path:url.href},'',url.href);
  }

  let data = JSON.parse(localStorage.getItem(dataName));

  data.plan = selectedPlan.attr("data-value")
  data.planId = minePlan.id;
  localStorage.setItem(dataName, JSON.stringify(data));
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

    let data = JSON.parse(localStorage.getItem(dataName));

    data.stateId = found.id;

    localStorage.setItem(dataName,JSON.stringify(data));

    $("#stateText").html(`${found.state.charAt(0).toUpperCase()}${found.state.slice(1)} State Fees`)
    stateFee = found.fee;
    $("#stateFee").html(`$${stateFee}`)
    let tot = parseInt(totalCost) + parseInt(stateFee);
    $("#totalCost").html(`$${tot}`);
  }
}

function callTotalFee() {

let p = JSON.parse(localStorage.getItem(dataName));
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
async function finalSubmission() {

//e.preventDefault();

  // step 4
 if(step == 4) {

      let pass = true;
      try {

        await finalStepValidation()

      }catch(err) {

         pass = false
         return false;
      }
       
      let startFleet = localStorage.getItem(dataName);

      // if local storage data is not available
      if(!startFleet) {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Form having errors',
          footer: '<a href="">Please contact us.</a>'
        })
        pass = false
        return false;

      }

      // get local data

      let items = JSON.parse(startFleet);
                
      const {
      companyName,
      cPhone,
      cName,
      cEmail,
      // businessDescription,
      SSNYN,
      suffix,
      members,
      plan,
      planId,
      state,
      stateId,
      structure,
      agree,
      country_c,
      country_r
       } = items;

      // set form data 

      const form_data = {

        company_name:companyName,
        company_state:state,
        company_structure:structure,
        company_suffix:suffix,
        // company_business_description:businessDescription,
        company_members:members,
        phone:cPhone,
        email:cEmail,
        full_name:cName,
        ssn_or_itin:SSNYN,
        plan,
        planId,
        stateId,
        termsAgree:agree,
        country_c,
        country_r
      }

      // set addons data

        let selectedItems = [];
        if(choosenProducts.length > 0) {
          
          choosenProducts.forEach((item)=> {

             let is_included = Boolean(item[`included_in_${plan}`]);
             let price = parseInt(item[`${plan}_price`]);
              
              if(!is_included && price > 0) {

                let p = {
                  id:item.id,
                  item_type:'addon',
                }
                selectedItems.push(p);
              }

          })
          
          if(selectedItems.length)
            form_data.addons = selectedItems;
        }

        //console.warn(form_data);
        //return;

        if(pass) {

          makeOrder(form_data);
          console.warn("submitting.....")
          return false;
        }

  }


}

// encharge 

function callEncharge( form_data ) {

const  {
    phone,
    email,
    full_name,
    plan,
    company_name,
    company_members,
    company_state
  } = form_data;

const resultIdentify = EncTracking.identify({ 
    email, 
    phone
  });

  // Make sure this code is placed after the Encharge Tracking JS snippet
const resultTrack = EncTracking.track(
  {
    // Name of this event (required)
    "name": "Checkout action", 
    // Properties of this event (optional)
    "properties": { 
      "Plan": plan,
      "state":company_state,
      "Members":company_members,
      "Company":company_name,
      "orderValue":totalCost ? `$${totalCost}` : 0

    },
    // Fields for the current user performing the event (required)
    "user": { 
      "email": email, 
      "name": full_name, 
      "phone":phone
    }
  }
);


  return true;


}

// send data to server

function makeOrder(form_data) {

  console.log(form_data);
  //return;

Swal.fire({
  title: 'We are preparing your purchase order!',
  html: 'redirecting you for payment...',
  timerProgressBar: true,
  didOpen: () => {
  Swal.showLoading()
  },
})

form_data.test = false;
if(version && source === 'test') {

   form_data.test = true;
}

//return;

$.ajax({

    url:API_ORDER,
    type:"POST",
    data:form_data,
    dataType:"JSON",
    success:function(resonse) {

    
      // track the order encharge
      callEncharge( form_data )
      
      onCheckout( 2 );

      setTimeout(()=>{
        Swal.close();
        const { url } = resonse
        
        // remove cookie if exists
        removeCookie('cname');
        removeCookie('cemail');

        window.location = url
      },1500)
    },
    error:function( error ) {

      Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Please contact us.</a>'
        })

        console.error( error );

    }

  })

}



// validate phone
function validate_phone() {

return new Promise(function(resolve,reject) {
  

      if(version && source === 'test') {

         return resolve(true);
      }

     let phone_num = $("#phone").val().trim()

      $.ajax({
      url:API_PHONE_VALIDATION,
      type:"GET",
      data:{ phone_num },
      dataType:"JSON",
      success:function( res ) {
        if(res.code == "VALID") {
          resolve(true);
        }else {
          reject(false)
        }
      },
      error:function( error ) {
        reject(false)
      }

      })

})
 
}
// validate email

function validate_email() {

    return new Promise(function(resolve,reject) {

      if(version && source === 'test') {

         return resolve(true);
      }
     
      let email = $("#Email-field").val().trim()

         $.ajax({
          url:API_EMAIL_VALIDATION,
          type:"GET",
          data:{ email },
          dataType:"JSON",
          success:function( res ) {

              if(res.code == "VALID") {
                console.warn("returning true")
                resolve(true)
              }else {
                reject(false);
              }
          },
          error:function( error ) {
            console.warn("returning false")
            reject(false);
          }
         })

    })

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



// setup products prices

function setProductPrices( plan ) {

 
  addonPrice = 0;

 //  $(".total-pricing-card > div:nth-child(1)").after().remove(".addons-pricing, .add-ons-item-pricing");
   $(".total-pricing-card").find(".addons-pricing, .add-ons-item-pricing").remove();

   let addonsString = `<div class="item-total-pricing-step-2 custom-padding-item-total-price-step-2 addons-pricing">
      <div class="title-item-card-list">Add ons:</div>
      <div class="subtotal-item-card-list">
      <div class="number-subtotal-item-list">$???</div>
      </div>
      </div>`;

    choosenProducts.forEach((cp)=>{

      let amt = 0;

      if(parseInt(cp.setup_fee) > 0) {
        amt = parseInt(cp[plan+'_price']) + parseInt(cp.setup_fee)
      }else {
        console.warn(plan+'_price');
         amt = parseInt(cp[plan+'_price']);
      }

      let is_included = cp[`included_in_${plan}`] === 'true' ? true:
      cp[`included_in_${plan}`] === 'false' ? false :
      Boolean(cp[`included_in_${plan}`]);

      

      //console.warn(`included_in_${plan}`);

      // console.log(Boolean(cp[`included_in_${plan}`]))

      addonsString+=`<div class="item-total-pricing-step-2 custom-padding-item-total-price-step-2 add-ons-item-pricing">
      <div class="title-item-card-list custom-weight-title-item-card-list">${cp.name}`;

     addonsString+= cp.setup_fee > 0 ? ' + Setup':'';
      //addonsString+= is_included ? ' (Included) ':'';
      addonsString+=`</div>
      <div class="subtotal-item-card-list">`;
      if(!is_included) {
        addonsString+=`<div class="number-subtotal-item-list custom-weight-title-item-card-list">$${amt}</div>`
      }else {
            addonsString+=`<div class="number-subtotal-item-list custom-weight-title-item-card-list">Included</div>`
      }
      
      addonsString+=`</div>
      </div>`;

      
      addonPrice+=amt;
    })

    addonsString = addonsString.replace('???',addonPrice);

    $(".total-pricing-card > div:nth-child(1)").after(addonsString);
    totalCost+=addonPrice;
    $("#totalCost").html(`$${totalCost}`)

}


// initialize function
function myinit() {



console.warn("init called");
 var plan        = getParameterByName('p'); // "plan"
 var companyType = getParameterByName('ct'); // "company type"
 var companyCity = getParameterByName('cct'); // "company city"
 var refcodes = getParameterByName('ref'); // "refcodes"
 var skip = getParameterByName('skip'); // "refcodes"
  version = getParameterByName('v')
  source  = getParameterByName('source')
 console.warn("init called");
 console.warn(!plan && !companyType && !companyCity)

 // if no values in url
 if((!plan && !companyType && !companyCity)) {

    let storage = localStorage.getItem(dataName);
    console.warn("storage")
    console.warn(storage)
    let data;

    if(storage) { // if storage is available
       
       data = JSON.parse(storage);

        let url = new URL(window.location.href);
        let search_params = url.searchParams;

        // if plan exists
        if(data.plan) {

             search_params.set('p',data.plan)
             if(!data.planId) {
              let minePlan = plans.filter((p) => p.name.toLowerCase() == data.plan.toLowerCase())[0]
              data.planId = minePlan.id;

             }
        }

        // if structure exists
        if(data.structure)  {
           search_params.set('ct',data.structure)
        }

        // if state exists
        if(data.state) {
           search_params.set('cct',data.state)
        } 

        // if refcodes exists
        if(data.refcodes && data.refcodes!="" && data.refcodes!="null") {
          search_params.set('ref',data.refcodes)
        } 

        if(version) {
          search_params.set('version',version)
        }

        if(source) {
          search_params.set('source',source)
        }

        // set modify storage

        localStorage.setItem(dataName,JSON.stringify(data));
        if (history.pushState) {
        window.history.pushState({path:url.href},'',url.href);
        window.location = window.location;
        }
    }
 }

// if values in url

// remove storage first
if(skip) {
  localStorage.removeItem(dataName);
  if(getCookie('cname')!=="" && getCookie("cemail") !=="") {
    let data = {
        cName:getCookie('cname'),
        cEmail:getCookie("cemail")
    }
    localStorage.setItem(dataName,JSON.stringify(data));

  }
  
}

let divStep = $(`.custom-step-${step}`);

  // let stateCheckboxes = divStep
  //           .find("div.wrapper-state").find("input[type='checkbox']")

    let stateCheckboxes = divStep
            .find("#state-list-main-wrap").find("input[type='radio']")
  
  

  let structureCheckboxes = divStep
            .find("div.wrapper-structure").find("input[type='checkbox']")

 if(companyCity) {
  stateCheckboxes.each(function() {
    if($(this).attr("data-value").toLowerCase() == companyCity.toLowerCase()) {

           // $(this).prev().addClass("w--redirected-checked")
            $(this).prop("checked",true);
            data = localStorage.getItem(dataName) ? JSON.parse(localStorage.getItem(dataName)) : {};
            data.state = $(this).attr("data-value")
            localStorage.setItem(dataName, JSON.stringify(data));
            //callStateFee(data);
    }
  })
}

  if(companyType) {
  structureCheckboxes.each(function() {
    if($(this).attr("data-value").toLowerCase() == companyType.toLowerCase()) {

      $(this).prev().addClass("w--redirected-checked")
      $(this).prop("checked",true);
       data = JSON.parse(localStorage.getItem(dataName));
       data.structure = $(this).attr("data-value")
       localStorage.setItem(dataName, JSON.stringify(data));
        changeSuffixOptions(data.structure)
    }
  })
}

if(companyCity && companyType) {

let found = dt.find(function (elm) {
      return (
        elm.structure.toLowerCase() == companyType.toLowerCase() &&
        elm.state.toLowerCase() == companyCity.toLowerCase()
      );
    });
  if(found) {
    let data = JSON.parse(localStorage.getItem(dataName));
    data.stateId = found.id;
    localStorage.setItem(dataName,JSON.stringify(data));
  }
}

 

 let planScreen = $(`.custom-step-2`);

 let planCheckboxes = planScreen
            .find("div.custom-grid-pricing-step-2").find("input[type='checkbox']")

  let mobilePlanCheckboxes = planScreen.find("div.slider-2").find("input[type='checkbox']");

  //console.log('mobile fiel');
 // console.log(mobilePlanCheckboxes);


if(plan) {
  planCheckboxes.each(function() {

    if($(this).attr("data-value").toLowerCase() == plan.toLowerCase()) {
      console.warn("matched")
      $(this).prev().addClass("w--redirected-checked")
      $(this).prop("checked",true);
       let data = JSON.parse(localStorage.getItem(dataName));

       console.log($(this).attr("data-value"));
       data.plan = $(this).attr("data-value")
       
       // set plan id

        let minePlan = plans.filter((p) => p.name.toLowerCase() == data.plan.toLowerCase())[0]
              data.planId = minePlan.id;


       localStorage.setItem(dataName, JSON.stringify(data));
          callTotalFee();
       
    }
  })

  mobilePlanCheckboxes.each(function(){

    if($(this).attr("data-value").toLowerCase() == plan.toLowerCase()) {
      console.warn("matched")
      $(this).prev().addClass("w--redirected-checked")
      $(this).prop("checked",true);
       let data = JSON.parse(localStorage.getItem(dataName));

       console.log($(this).attr("data-value"));
       data.plan = $(this).attr("data-value")
       
       // set plan id

        let minePlan = plans.filter((p) => p.name.toLowerCase() == data.plan.toLowerCase())[0]
              data.planId = minePlan.id;

       // call setPlanIndex
       setPlanIndex(minePlan.name)

       localStorage.setItem(dataName, JSON.stringify(data));
          callTotalFee();
       
    }
  })
}

 if(refcodes) {

    codes = refcodes.split("-")
    choosenProducts = []
   if(codes.length) {
     
     let data = JSON.parse(localStorage.getItem(dataName));
     data.refcodes = refcodes;
     localStorage.setItem(dataName, JSON.stringify(data));

     codes.forEach((co)=>{
        choosenProducts.push(products.filter((prod)=> prod.refcode == co )[0])
     })
  }

  // if addons exists
  
   if(choosenProducts.length) {

    // set product prices

      setProductPrices( plan );
     
   }
   
 }
 // skip first time validation for company details
 if(plan && !skip) {

      Swal.fire({
        title: 'Please wait a moment... !',
        timerProgressBar: true,
        timer:1000,
        didOpen: () => {
        Swal.showLoading()
        },
      })

    byPassStep3 = true; // set by pass true so validation won't be trigger
    $(".next-button-venom").trigger("click"); // pass the next step
    byPassStep3 = false; // set by pass false so validation would trigger
    
  }

    // skip first step
 if(parseInt(skip) == 1) {

      Swal.fire({
        title: 'Please wait a moment... !',
        timerProgressBar: true,
        timer:1000,
        didOpen: () => {
        Swal.showLoading()
        },
      })

    byPassStep2 = true; // set by pass true so validation won't be trigger
    $(".next-button-venom").trigger("click"); // pass the next step
    byPassStep2 = false; // set by pass false so validation would trigger
    
  }

  // check if other fields data is stored in localstorage
   checkOtherFieldsDefault();

   if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

      $('.slider-2').find(".w-round").children()[planIndex].click()
    }
}

function checkOtherFieldsDefault() {

let otherFieldsData = localStorage.getItem(dataName) ? JSON.parse(localStorage.getItem(dataName)) : false;

  // is localstaorge exists
  if(otherFieldsData) {

    // if companyname exists then set
    if(otherFieldsData.companyName) {
      $("#Company-name-2").val(otherFieldsData.companyName);
    }

    // if suffix exists then set
    if(otherFieldsData.suffix) {
      $("#SSN-or-ITIN-2").val(otherFieldsData.suffix)
    }

    // if business description exists then set
    if(otherFieldsData.businessDescription) {
      //$("#Business-desc-form").val(otherFieldsData.businessDescription)
    }

    // if members exists then set
    if(otherFieldsData.members) {

      let cntMember = 0;
      $("div.wrapper-option-member-step-3 label.w-checkbox").each(function() {

        if(parseInt(otherFieldsData.members) > cntMember) {

           $(this).find("div.w-checkbox-input").addClass("w--redirected-checked")
           $(this).find("input[type='checkbox']").prop("checked",true);
        }
        cntMember++;

      });

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

    }

    // if customer name exists then set
    if(otherFieldsData.cName) {
      $("#Full-name").val(otherFieldsData.cName)
    }

    // if customer email exists then set
    if(otherFieldsData.cEmail) {
      $("#Email-field").val(otherFieldsData.cEmail)
    }
    
    // if itin or ssn exists then set
    if(otherFieldsData.SSNYN) {
      $("#SSN-or-ITIN").val(otherFieldsData.SSNYN)
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

        let data = localStorage.getItem(dataName) 
        ? JSON.parse(localStorage.getItem(dataName)) : {}

        data.countryCode = code;

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
      errorMsg.innerHTML = errorMap[errorCode]?? 'Invalid number';
      errorMsg.classList.remove("hide");
    }
  }
});
input.addEventListener('change', reset);
input.addEventListener('keyup', reset);


// datalayer work

function onCheckout( step ) {

  let data = JSON.parse(localStorage.getItem(dataName));

  const { 
    
    planId, 
    stateId, 
    refcodes, 
    cEmail, 
    cName, 
    cPhone, 
    country_c, 
    country_r 
  } = data;

  if(!planId || !stateId) {
   console.log('sorry skipping plan/state not available in');
   return false;
  }

  let selectedPlan = plans.filter((plan)=> plan.id === planId)[0]
  let selectedState = dt.filter((state)=> state.id === stateId)[0]
  let selectedProducts =[]

  if(step!=2) {
     if(selectedPlan) {
      bucketProducts.push({
             'name': selectedPlan.name,
             'id': selectedPlan.merchandise_id,
             'price': selectedPlan.price,
            // 'brand': 'Google',
             'category': 'plan',
           //  'variant': 'Gray',
             'quantity': 1
      })
      bucketPrice = parseFloat(bucketPrice) + parseFloat(selectedPlan.price)
     }
  if(selectedState) {
   bucketProducts.push({
          'name': `${selectedState.state}/${selectedState.structure}`,
          'id': selectedState.merchandise_id,
          'price': selectedState.fee,
         // 'brand': 'Google',
          'category': 'state',
        //  'variant': 'Gray',
          'quantity': 1
   })

   bucketPrice = parseFloat(bucketPrice) + parseFloat(selectedState.fee)

  }
  //console.warn(selectedPlan)
  //console.warn(selectedState)
  //console.warn(refcodes)

  if(refcodes) {

   let addonsIds = refcodes.split("-")

   addonsIds.forEach((add)=>{

      let product =products.filter((product) => parseInt(product.refcode) === parseInt(add))[0];

      selectedProducts.push(product)
   })

   //console.error(addonsIds);
  }

  if(selectedProducts.length) {

   let pkey = (selectedPlan.name).toLowerCase();

      selectedProducts.forEach((product)=> {

          bucketProducts.push({
             'name': `${product.name}`,
             'id': product.merchandise_id,
             'price': product[pkey+'_price'],
            // 'brand': 'Google',
             'category': 'addon',
           //  'variant': 'Gray',
             'quantity': 1
         })

           bucketPrice = parseFloat(bucketPrice) + parseFloat(product[pkey+'_price'])
 
      })
  }

  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'checkout',
    'ecommerce': {
      'checkout': {
        'actionField': {
         'step': step ,
         'revenue': bucketPrice,
         'currency':'USD'   
      },
        'products': bucketProducts
     }
   },
   // 'eventCallback': function() {
   //    console.log('datalayer event triggered')
   // }
  });


} // if step !=2
else {
  console.error(bucketProducts);
  //console.log(selectedProducts);
  //console.log(data);
  //console.log(plans)
  //console.log(dt)
  //console.log(products)

  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'checkout',
    'ecommerce': {
      'checkout': {
        'actionField': {
         'step': step ,
         'revenue': bucketPrice,
         'currency':'USD'   
      },
        'products': bucketProducts
     }
   },
   // 'eventCallback': function() {
   //    console.log('datalayer event triggered')
   // }
  });

    const updValues = {

    "email": cEmail , // replace yourEmailVariable with variable name that captures your user’s email
     "phone_number": cPhone , // repeat for yourPhoneVariable and following variable names below
      "address": {
      "first_name": cName,
      "last_name": cName ,
      // "street": yourStreetAddressVariable ,
     // "city": city ,
     // "region": region ,
     // "postal_code": postalCode ,
      "country": country_r
      }
    }

    dataLayer.push({
    'upd':updValues,
    });
  }
}

function cleanBucket() {

   bucketProducts = [];
   bucketPrice = 0;

}

function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toLowerCase();
  console.log(filter)
  ul = $("#state-list-main-wrap");
  
  li = ul.find('div.state-list-details-wrap');

  // Loop through all list items, and hide those who don't match the search query
  li.each(function(i,el) {
   txtValue = $(this).find("input[type='radio']").attr("data-value").toLowerCase()
      console.log($(this).find("input[type='radio']").attr("data-value"))

      if (txtValue.indexOf(filter) > -1) {
        $(this).show()
      } else {
        $(this).hide()
      }
   //console.log(el.find("input[type='radio']").attr("data-value"));
  })
}