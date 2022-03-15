 const API_ORDER_INFO = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/order-details-by-session`
var dataName = 'sf_store_database';
// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// encharge 

function callEncharge( form_data ) {

const  {
    phone,
    email,
    full_name,
    order_id,
    totalCost
  } = form_data;

const resultIdentify = EncTracking.identify({ 
    email, 
    phone
  });

  // Make sure this code is placed after the Encharge Tracking JS snippet
const resultTrack = EncTracking.track(
  {
    // Name of this event (required)
    "name": "Purchase action", 
    // Properties of this event (optional)
    "properties": { 
      "OrderId": order_id,
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

// get order information by session id
function getOrderInformation() {

  var sessionId = getParameterByName('session_id'); // "session id"

  $.ajax({

    url:API_ORDER_INFO,
    type:"GET",
    data:{ sessionId },
    dataType:"JSON",
    success:function(response) {
        //console.log(resonse)
        const { order_id, email, tracked,totalCost } = response;
       
        $("#order-number").html(order_id)
        $("#customer-email").html(email)
        localStorage.removeItem(dataName);
        setSurveyValues(response);
        // track the order encharge

        // console.warn(tracked)
         //console.log(tracked!='yes');
          callDataLayer( response )
        if(tracked!='yes') {
          callEncharge(response);
         
        }
        
    },
    error:function( error ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Could not find the order",
        footer: '<a href="mailto:hello@startfleet.io">Please contact us.</a>'
      })
    }
  })

}

// 
$(function() {


localStorage.removeItem(dataName);

getOrderInformation();

})


function setSurveyValues( response ) {

  window.qwarySettings = {
  surveyId : '3Y6A066rNaDrV17TDvQBN1ILBa5a-X3XYqFdbdB9zJQ=',
  popupHeight : '600px',
  popupWidth : '100%',
  layout : 'inline',
  container: 'qwary-widget',
  contact : {
     email : response.email,
     firstName : response.full_name.split(" ")[0],
     lastName : response.full_name.split(" ")[1],
    // // streetAddress : ‘<%= contact street address %>‘,
    // // city : ‘<%= contact city %>‘,
    // // country: ‘<%= contact country %>‘,
    // // state: ‘<%= contact state %> ‘,
    // // postalCode: ‘<%= contact postal code %>‘,
    // // department: ‘<%= contact department %>‘,
     phoneNumber: response.phone
  }
};

//console.warn(window.qwarySettings);
window.qwary.survey();

}

function callDataLayer( form_data ) {


  console.log( form_data );

}