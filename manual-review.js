$(document).ready(function() {

  $( "#review_date" ).datepicker();
  
  $( "#review_date" ).datepicker( "option", "dateFormat", "M d, yy" );

$("#label_review_video_link").hide();
$("#review_video_link").hide();

$("#review_type").change(function() {

 if($(this).val() === 'text') {
 	$("#label_review_video_link").hide();
	$("#review_video_link").hide();
  
  $("#label_review_text").show();
	$("#review_text").show();
 }else {
 	$("#label_review_video_link").show();
	$("#review_video_link").show();
  
   $("#label_review_text").hide();
	$("#review_text").hide();
 
 }

})
$("#search-button").click(async function() {


  let form = $("#search-form").serializeArray();
  let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
  let errors = [];
  let promises = [];
  let formData = { form:{} }
  let requireReviewTex  = false;
  let requireReviewVideo = false;
  form.forEach(function(field) {

    
    if(field.name === 'review_user' && field.value.trim() ==='') {
      errors.push(`User Name required`);
    }
		
     if(field.name === 'review_date' && field.value.trim() ==='' ) {
      errors.push(`Review date required`);
    }
    
     if(field.name === 'review_text' && field.value.trim() ==='' ) {
      //errors.push(`Review text required`);
      requireReviewTex = true;
      
    }
     if(field.name === 'review_video_link' && field.value.trim() ==='' ) {
      //errors.push(`Review text required`);
      requireReviewVideo = true;
      
    }
    if(field.name === 'review_title' && field.value.trim() ==='' ) {
      errors.push(`Review title required`);
    }
    

    if(field.name === 'review_rating' && (parseInt(field.value) < 0 || parseInt(field.value) > 5) ) {
      errors.push(`Rating should be between 0-5 required`);
    }

   
    if(field.name === 'admin_email' && !pattern.test(field.value) ) {
      errors.push(`Admin Email required`);
    }

     if(field.name === 'admin_password' && field.value.trim() ==='') {
      errors.push(`Admin Password required`);
    }
    
  })
if(requireReviewVideo === true && requireReviewTex === true) {
 errors.push(`Review text or video link required`);

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

    if(field.name === 'review_user' ) {
      formData['form']['review_user'] = field.value;
    }

    if(field.name === 'review_user_link' ) {
      formData.form.review_user_link = field.value;
    }

    if(field.name === 'review_date'  ) {
     formData.form.review_date = field.value;
    }

    if(field.name === 'review_text' ) {
      formData.form.review_text = field.value;
    }
     if(field.name === 'review_video_link' ) {
      formData.form.review_video_link = field.value;
    }

    if(field.name === 'review_link' ) {
      formData.form.review_link = field.value;
    }
    
    if(field.name === 'review_title') {
      formData.form.review_title = field.value;
    }
    
    if(field.name === 'review_rating') {
      formData.form.review_rating = field.value;
    }
    
    if(field.name === 'review_type') {
      formData.form.review_type = field.value;
    }

    })

    //formData.form.test = test;
    formData.form.review_platform = "manual";
   	makeReview(formData);

  }

  console.log(errors);
})


function makeReview(form_data) {

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
  title: 'We are preparing new review!',
  timerProgressBar: true,
  didOpen: () => {
  Swal.showLoading()
  },
})

//return;

$.ajax({

    url:"https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/api_manual_review",
    type:"POST",
    data:{ reviews:[form_data.form], 
    email: form_data.email, 
    password:form_data.password },
    dataType:"JSON",
    success:function(res) {

        Swal.close();

        const { response } = res


        

        Swal.fire({
          icon: 'success',
          title: 'Great! review is ready..',
          showCloseButton: false,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Great!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
           }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          //if (result.isConfirmed) {
              window.location =window.location
          //}
        })
    
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


})