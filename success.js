const API_ORDER_INFO = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/order-details-by-session`

// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// get order information by session id
function getOrderInformation() {

	var sessionId = getParameterByName('session'); // "session id"

	$.ajax({

    url:API_ORDER_INFO,
    type:"GET",
    data:{ sessionId },
    dataType:"JSON",
    success:function(resonse) {
    		console.log(resonse)

    		//setSurveyValues();
    },
    error:function( error ) {
        	console.error( error );
    }
  })

}

$(function() {

getOrderInformation();

})()


function setSurveyValues() {

	window.qwarySettings = {
	surveyId : '3Y6A066rNaDrV17TDvQBN1ILBa5a-X3XYqFdbdB9zJQ=',
	popupHeight : '600px',
	popupWidth : '100%',
	layout : 'inline',
	container: 'qwary-widget',
	contact : {
		// email : ‘<%= contact email address %>‘,
		// firstName : ‘<%= contact first name %>‘,
		// lastName : ‘<%= contact last name %>‘,
		// // streetAddress : ‘<%= contact street address %>‘,
		// // city : ‘<%= contact city %>‘,
		// // country: ‘<%= contact country %>‘,
		// // state: ‘<%= contact state %> ‘,
		// // postalCode: ‘<%= contact postal code %>‘,
		// // department: ‘<%= contact department %>‘,
		// phoneNumber: ‘<%= contact phone number %>’
	}
};
window.qwary.survey();

}

