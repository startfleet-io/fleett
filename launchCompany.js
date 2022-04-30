var city = geotargeto_city()
var launchDomain = `https://launch.startfleet.io/`
if(document.getElementById('user-city')) {
  document.getElementById('user-city').innerHTML = city
}

$(function() {
const API_EMAIL_VALIDATION =`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/check-email`;
var fieldName = $("#field-8");
var fieldEmail = $("#field-6");
var fieldCompanyCity = $("#field-7");
var fieldCompanyType = $("#field-9");
var formErrorMsg = '<div class="invalid-insert show-left">';
    formErrorMsg+='###';
    formErrorMsg+='</div>';
var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
var pass = true;
var isEmailValid = false
var dataName = 'sf_store_database';
// validate email


function validate_email() {

    return new Promise(function(resolve,reject) {
      //resolve(true);
      let email = fieldEmail.val().trim()

         $.ajax({
          url:API_EMAIL_VALIDATION,
          type:"GET",
          data:{ email },
          dataType:"JSON",
          success:function( res ) {

              if(res.code == "VALID") {
                console.warn("returning true")
                resolve(true)
              } else if(res.code == "RETRY") {
              isEmailValid = true;
              	resolve(true)
              } else {
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

fieldEmail.on("change",async function() {

          var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
          
          fieldEmail.nextAll("div.invalid-insert").remove();

          if(!pattern.test(fieldEmail.val().trim()))
          {
             
              let msg = formErrorMsg.replace('###','Please enter valid email!')
              fieldEmail.after(msg);
              pass = false;
          } else {

            try {
                await validate_email();
								pass = true
            } catch( err ) {


              let msg = formErrorMsg.replace('###','Please enter valid email!')
              fieldEmail.after(msg);
              pass = false;


            }
          }

  //console.log($(this).val())
});
         
$(document).on("click",".formbtn-2" ,async function() {

		fieldName.next("div.invalid-insert").remove();
 		if((fieldName.val()).trim() == '') {

    let msg = formErrorMsg.replace('###','Please enter your full name!')

       fieldName.after(msg);
       pass = false
      
    }
    fieldEmail.nextAll("div.invalid-insert").remove();
    if((fieldEmail.val()).trim() == '') {

        let msg = formErrorMsg.replace('###','Please enter your email!')

       fieldEmail.after(msg);
       pass = false
      
    }
    
     if((fieldEmail.val()).trim() !== '' && !isEmailValid) {
     
     		if(!pattern.test(fieldEmail.val().trim()))
          {
            	pass = false
              let msg = formErrorMsg.replace('###','Please enter valid email!')
              fieldEmail.after(msg);
              
          } else {
               try {
                 await validate_email();
                 pass = true
              } catch(err) {

                pass = false
                let msg = formErrorMsg.replace('###','Please enter valid email!')
                fieldEmail.after(msg);

              }
          }
    }
	fieldCompanyCity.next("div.invalid-insert").remove();
   if((fieldCompanyCity.val()).trim() == '') {

        let msg = formErrorMsg.replace('###','Please choose city!')

       	fieldCompanyCity.after(msg);
       	pass = false
      
    }
		fieldCompanyType.next("div.invalid-insert").remove();
    if((fieldCompanyType.val()).trim() == '') {

        let msg = formErrorMsg.replace('###','Please choose type!')

       	fieldCompanyType.after(msg);
       	pass = false
      
    }
	if(pass) {
  
     // let order_url = 'order?';
      let order_url = `${launchDomain}?`;
     // order_url+= 'p=startup';
      order_url+= '&ct='+(fieldCompanyType.val()).toLowerCase();
      order_url+= '&cct='+(fieldCompanyCity.val()).toLowerCase();
      order_url+= '&skip=1';
      let name = (fieldName.val()).trim()
      let email = (fieldEmail.val()).trim()
      let data = {
        name,
        email
      }

      const d = new Date();
      d.setTime(d.getTime() + (1*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();

      document.cookie = `cname=${name};cemail=${email}; ${expires}; path=/`
      //localStorage.setItem(dataName, JSON.stringify(data));
      console.warn(document.cookie);

      //window.location.href = order_url;
  
  }

})


})


