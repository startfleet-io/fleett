$(document).ready(function(){

$("#company_structure").empty()
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

var API_BASE = `https://xe5a-injf-5wxp.n7.xano.io`;

var API_EMAIL_VALIDATION = `${API_BASE}/api:z9NOXVAQ/check-email`
var API_PHONE_VALIDATION = `${API_BASE}/api:z9NOXVAQ/check-phone`
var API_ORDER =`${API_BASE}/api:z9NOXVAQ/manual-order`
var test = false;
// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function changeSuffixOptions( structure ) {

  let strLower = structure.toLowerCase();
  let options = suffix[strLower];

  if(options.length) {
    let suffId = $("#company_suffix");
    suffId.empty()
    suffId.append(`<option value="">Select</option>`)
    options.forEach(function(opt) {
      suffId.append(`<option value="${opt}">${opt}</option>`)
    })
  }

}


// validate phone
function validate_phone() {

return new Promise(function(resolve,reject) {
  

    
     let phone_num = $("#customer_phone").val().trim()

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
function validate_email( field_name) {

    return new Promise(function(resolve,reject) {

     
      let email = $(`#${field_name}`).val().trim()

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
                reject({msg : `Invalid ${field_name}`});
              }
          },
          error:function( error ) {
            console.warn("returning false")
            reject({msg : `Invalid ${field_name}`});
          }
         })

    })

}

function setPlans() {

$.ajax({

    url:"https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/plan",
    type:"GET",
    dataType:"JSON",
    success:function(response) {
    
    let plans = response;
    $("#planId").empty();
    plans.forEach(function(plan) {

      $("#planId").append(`<option value="${plan.id}">${plan.name} - $${plan.price}</option>`);

    })
    
    setStates()

    }
  
  })

}
function setStates() {

  $.ajax({

    url:"https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/state-fees",
    type:"GET",
    dataType:"JSON",
    success:function(response) {
    
    let states = response;
    let exists = new Array();

    $("#company_state").empty();
    states.forEach(function(state) {

      if(!exists.includes(state.state)) {
        $("#company_state").append(`<option value="${state.state}">${state.state}</option>`);

        exists.push(state.state)
      }

    })
    
      setStructures(states)
    }
  
  })

}

function setStructures(states) {

  $("#company_structure").empty();
   $("#company_structure").append(`<option value="">select</option>`);
  let exists = new Array();
  states.forEach(function(state) {

      if(!exists.includes(state.structure)) {
        $("#company_structure").append(`<option value="${state.structure}">${state.structure}</option>`);

        exists.push(state.structure)
      }

    })

  $("#company_suffix").empty();

  let  suffixes = ['LLC','L.L.C.','Limited Liability Company'];

  suffixes.forEach(function(suffix) {

      
       // $("#company_suffix").append(`<option value="${suffix}">${suffix}</option>`);

    })

  $("#stateId").empty()

  states.forEach(function(state) {

      
        $("#stateId").append(`<option value="${state.id}">${state.state}-${state.structure}-$${state.fee}</option>`);

        
     

    })

}


function setRequiredFields() {

  var source = getParameterByName('source');

  if(source === 'test') {

    test = true;

     $.ajaxSetup({
      beforeSend: function (xhr)
      {
       xhr.setRequestHeader("X-Data-Source","test");
      // xhr.setRequestHeader("Authorization","Token token=\"FuHCLyY46\"");        
      }
    })
  }

  setPlans();

  var countries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
         //console.log(countries)

           $("#customer_citizenship").empty()
            .append(`<option value=''>Choose Country</option>`)

            $("#customer_residentialship-2").empty()
            .append(`<option value='' >Choose Country</option>`)

         countries.forEach((c)=>{

            let selected = c === 'United States' ? 'selected' : ''
            $("#customer_citizenship")
            .append(`<option value='${c}'>${c}</option>`)

            $("#customer_residentialship-2")
            .append(`<option value='${c}'>${c}</option>`)
         })
}
setRequiredFields();

$("#search-button").click(async function() {


  let form = $("#search-form").serializeArray();
  let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
  let errors = [];
  let promises = [];
  let formData = { form:{} }
  
  form.forEach(function(field) {

    
    if(field.name === 'company_name' && field.value.trim() ==='') {
      errors.push(`Company Name required`);
    }

    if(field.name === 'customer_email' && !pattern.test(field.value)) {
      errors.push(`Customer Email required`);
    }

    if(field.name === 'customer_email' && pattern.test(field.value)) {
      try {
         promises.push(validate_email('customer_email'))
      }catch(err) {

        errors.push(`Valid customer Email required`);
      }
      
    }

    if(field.name === 'company_members' && parseInt(field.value) <=0 ) {
      errors.push(`Company Members required`);
    }

    if(field.name === 'customer_phone' && field.value.trim() ==='' ) {
      errors.push(`Customer Phone required`);
    }

    if(field.name === 'customer_name' && field.value.trim() ==='' ) {
      errors.push(`Customer Name required`);
    }
    
    if(field.name === 'customer_citizenship' && field.value.trim() ==='' ) {
      errors.push(`Customer Citisenship required`);
    }
    
     if(field.name === 'customer_residentialship' && field.value.trim() ==='' ) {
      errors.push(`Customer Residentialship required`);
    }

    if(field.name === 'admin_email' && !pattern.test(field.value) ) {
      errors.push(`Admin Email required`);
    }

    if(field.name === 'admin_email' && pattern.test(field.value) ) {
       try {
       promises.push(validate_email('admin_email-2'));
      }catch(err) {

        errors.push(`Valid admin Email required`);
      }
      
    }

     if(field.name === 'admin_password' && field.value.trim() ==='') {
      errors.push(`Admin Password required`);
    }
    
  })

  try {
      await Promise.all(promises);
    }catch(err) {

      errors.push(`Valid customer/admin Email required`);
       
  }

  if (errors.length > 0) {


    let msgError = '<div>';
    errors.forEach(function(err) {
      msgError+=`<p>${err}</p>`;
    })
    msgError+='</div>';

    Swal.fire({
          icon: 'error',
          title: 'Invalid form values',
          html: msgError
        })


  }else {

    
    form.forEach(function(field) {

        if(field.name === 'admin_email') {
       
          formData.email = field.value;
        }

        if(field.name === 'admin_password') {
       
          formData.password = field.value;
        }

    if(field.name === 'company_name' ) {
      formData['form']['company_name'] = field.value;
    }

    if(field.name === 'customer_email' ) {
      formData.form.email = field.value;
    }

    if(field.name === 'company_members'  ) {
     formData.form.company_members = field.value;
    }

    if(field.name === 'customer_phone' ) {
      formData.form.phone = field.value;
    }

    if(field.name === 'customer_name' ) {
      formData.form.full_name = field.value;
    }
    
    if(field.name === 'customer_citizenship') {
      formData.form.country_c = field.value;
    }
    
    if(field.name === 'customer_residentialship') {
      formData.form.country_r = field.value;
    }
    if(field.name === 'company_state') {
      formData.form.company_state = field.value;
    }
    if(field.name === 'company_structure') {
      formData.form.company_structure = field.value;
    }
    if(field.name === 'company_suffix') {
      formData.form.company_suffix = field.value;
    }
    if(field.name === 'planId') {
      formData.form.planId = field.value;
    }
     if(field.name === 'stateId') {
      formData.form.stateId = field.value;
    }
    
    if(field.name === 'ssn_or_itin') {
      formData.form.ssn_or_itin = field.value;
    }

      formData.form.termsAgree = 'Yes';
    
    

    })

    formData.form.test = test;
    makeOrder(formData);

  }

  console.log(errors);
})

function makeOrder(form_data) {

  console.log(form_data);

  if(form_data.form.test === true) {

     $.ajaxSetup({
      beforeSend: function (xhr)
      {
       xhr.setRequestHeader("X-Data-Source","test");
      // xhr.setRequestHeader("Authorization","Token token=\"FuHCLyY46\"");        
      }
    })
  }
  //return;

Swal.fire({
  title: 'We are preparing your purchase order!',
  html: 'redirecting you for payment...',
  timerProgressBar: true,
  didOpen: () => {
  Swal.showLoading()
  },
})

//return;

$.ajax({

    url:API_ORDER,
    type:"POST",
    data:form_data,
    dataType:"JSON",
    success:function(res) {

        Swal.close();

        const { response } = res


        if(response.result.url) {

        Swal.fire({
          icon: 'success',
          title: 'Great! Order is ready..',
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Great!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          html:
          `Order Number Is: <b>${response.result.metadata.purchase_order_id}</b> <br />You can use this link to pay ==> <a href="${response.result.url}" target="_blank">Pay Here</a> `,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          //if (result.isConfirmed) {
              window.location =window.location
          //}
        })

        }else {
          console.warn('somthing went wrong')
          console.log(response);
        }
        
    
    },
    error:function( error ) {

      const { status, responseJSON } = error;

      Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: responseJSON.message
        })

        console.error( error );

    }

  })

}

$(document).on("click","#company_structure",function() {

  changeSuffixOptions($(this).val())

})





})