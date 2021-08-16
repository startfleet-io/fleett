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
    var codes = [];
    var choosenProducts = [];
    var x,y,z;
    var retries = 0;

    var formErrorMsg = '<div class="invalid-insert show-left">';
    formErrorMsg+='###';
    formErrorMsg+='</div>';

    var defaultData = JSON.stringify({});

    var dataName = 'sf_store_database';

    const API_PRICING = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/pricing`;

    const API_EMAIL_VALIDATION =`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/check-email`;

    const API_PHONE_VALIDATION = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/check-phone`

    const API_ORDER = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/order`

    var isEmailTrue = true;
    var isPhoneTrue = true;

// get pricing

function getPricing() {

$.get(API_PRICING,{},async function(data, textStatus, jqXHR) {

    plans = data.plans;
    dt = data.state_fess;
    products = data.products

     x = plans.filter((item)=> item.name.toLowerCase() == "corvette")
     y = plans.filter((item)=> item.name.toLowerCase() == "frigate")
     z = plans.filter((item)=> item.name.toLowerCase() == "cruiser")

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


// step1 validation

function stateValidation( divStep ) {

let stateElements = divStep
            .find("div.wrapper-state")
            .find("input:checked");


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

  let planElements = divStep
          .find("div.custom-grid-pricing-step-2")
          .find("input:checked");

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

     $("#Business-desc-form")
        .next("div.invalid-insert")
        .remove();
            

      if(($("#Business-desc-form").val()).trim() == '') {

         let msg = formErrorMsg.replace('###','Please enter business description!')
         $("#Business-desc-form")
         .after(msg);
         pass = false
        //return false;

      }

      $("#Business-desc-form")
        .next("div.invalid-insert")
        .remove();

    if((($("#Business-desc-form").val()).trim()).length < 20) {

      let msg = formErrorMsg.replace('###','Please enter business description at least 20 characters long!')
       $("#Business-desc-form")
       .after(msg);
       pass = false
       //return false;
    }

    if(pass) {

    let data = localStorage.getItem(dataName);
    data = JSON.parse(data);
    data.companyName = ($("#Company-name-2").val()).trim()
    data.SSN = ($("#SSN-or-ITIN-2").val()).trim()
    data.businessDescription = ($("#Business-desc-form").val()).trim()
    data.members = totalMembers
    localStorage.setItem(dataName, JSON.stringify(data));

      return true;
    }
    return false

} 
$(document).on("change","#phone",async function() {

    $("#phone").next("div.invalid-insert").remove();
    
    try {

      await validate_phone()
      isPhoneTrue = true;

    }catch(err) {

       let msg = formErrorMsg.replace('###','Please enter valid phone number!')
       isPhoneTrue = false;
       $("#phone").after(msg);
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


     $("#SSN-or-ITIN").next("div.invalid-insert").remove();

      if(($("#SSN-or-ITIN").val()).trim() == '') {
        pass = false
        let msg = formErrorMsg.replace('###','Please choose!')
         $("#SSN-or-ITIN").after(msg);
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
          if(step == 2) {

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
          if(step == 3) {
           
            let pass =  true;

            if(!companyDetailsValidation()) {
              pass = false
              return false
            }

           if(pass) {
            return true;
           }

           return false; // default return
            
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
  let choosenProduct = selectedPlan.attr("data-value")
  console.log(choosenProduct)
  let minePlan = plans.filter((p)=> p.name.toLowerCase() == choosenProduct.toLowerCase())[0];




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
      businessDescription,
      SSNYN,
      SSN,
      members,
      plan,
      planId,
      state,
      stateId,
      structure } = items;

      // set form data 

      const form_data = {

        company_name:companyName,
        company_state:state,
        company_structure:structure,
        company_suffix:SSN,
        company_business_description:businessDescription,
        company_members:members,
        phone:cPhone,
        email:cEmail,
        full_name:cName,
        ssn_or_itin:SSNYN,
        plan,
        planId,
        stateId
      }

      // set addons data

        let selectedItems = [];
        if(choosenProducts.length > 0) {
          
          choosenProducts.forEach((item)=> {
            let p = {
              id:item.id,
              item_type:'addon',
            }
            selectedItems.push(p);

          })
          form_data.addons = selectedItems;
        }

        if(pass) {

          makeOrder(form_data);
          console.warn("submitting.....")
          return false;
        }

  }


}

// send data to server

function makeOrder(form_data) {


Swal.fire({
  title: 'We are prepairing your purchase order!',
  html: 'redirecting you for payment...',
  timerProgressBar: true,
  didOpen: () => {
  Swal.showLoading()
  },
})

$.ajax({

    url:API_ORDER,
    type:"POST",
    data:form_data,
    dataType:"JSON",
    success:function(resonse) {

      setTimeout(()=>{
        Swal.close();
        const { url } = resonse
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
   //resolve(true);
   //return;
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
      //resolve(true);
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


// initialize function
function init() {

 var plan        = getParameterByName('p'); // "plan"
 var companyType = getParameterByName('ct'); // "company type"
 var companyCity = getParameterByName('cct'); // "company city"
 var refcodes = getParameterByName('ref'); // "refcodes"
 
 // if no values in url
 if((!plan && !companyType && !companyCity)) {

    let storage = localStorage.getItem(dataName);
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

localStorage.removeItem('data');

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

      addonsString+=`<div class="item-total-pricing-step-2 custom-padding-item-total-price-step-2 add-ons-item-pricing">
      <div class="title-item-card-list custom-weight-title-item-card-list">${cp.name}`;

      addonsString+= cp.setup_fee > 0 ? ' + Setup':'';
      addonsString+=`</div>
      <div class="subtotal-item-card-list">
      <div class="number-subtotal-item-list custom-weight-title-item-card-list">${amt}</div>
      </div>
      </div>`;

      
      addonPrice+=amt;
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