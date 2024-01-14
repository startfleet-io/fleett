// var API_ORDER_INFO = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/order-details-by-session`

var API_ORDER_INFO = ``;
var API_ORDER_REDITUS = ``;
var dataName = 'sf_store_database';
const API_BASE = `https://xe5a-injf-5wxp.n7.xano.io`;
// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setUpTestEnv() {
    let version = getParameterByName('v');
    let source = getParameterByName('source');

    if (version && source) {
        API_VERSION = `:v${version}`;
        API_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/order-details-by-session`;
        API_ORDER_REDITUS = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/api_new_reditus_conversion_payment`;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Data-Source', 'test');
                // xhr.setRequestHeader("Authorization","Token token=\"FuHCLyY46\"");
            },
        });
    } else {
        API_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ/order-details-by-session`;
        API_ORDER_REDITUS = `${API_BASE}/api:z9NOXVAQ/api_new_reditus_conversion_payment`;
        console.log('you are trying to use live env');
    }
}

setUpTestEnv();

// encharge

function callEncharge(form_data) {
    const { phone, email, full_name, order_id, totalCost } = form_data;

    const resultIdentify = EncTracking.identify({
        email,
        phone,
    });

    // Make sure this code is placed after the Encharge Tracking JS snippet
    const resultTrack = EncTracking.track({
        // Name of this event (required)
        name: 'Purchase action',
        // Properties of this event (optional)
        properties: {
            OrderId: order_id,
            orderValue: totalCost ? `$${totalCost}` : 0,
        },
        // Fields for the current user performing the event (required)
        user: {
            email: email,
            name: full_name,
            phone: phone,
        },
    });

    return true;
}

function displayOrderInfo(){
    const orderId = getParameterByName('oid');
    const email = getParameterByName('email');
    $('#order-number').html(orderId);
    $('#customer-email').html(email);
}


// get order information by session id
// function getOrderInformation() {
//     var sessionId = getParameterByName('session_id'); // "session id"
//     var source = getParameterByName('source'); // "session id"
//     var data = { sessionId };
//     if (source && source === 'test') {
//         $.ajaxSetup({
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('X-Data-Source', 'test');
//                 // xhr.setRequestHeader("Authorization","Token token=\"FuHCLyY46\"");
//             },
//         });

//         data['x-data-source'] = `test`;
//     }

//     $.ajax({
//         url: API_ORDER_INFO,
//         type: 'GET',
//         data: data,
//         dataType: 'JSON',
//         success: function (response) {
//             //console.log(resonse)
//             const { order_id, email, tracked, totalCost } = response;

//             $('#order-number').html(order_id);
//             $('#customer-email').html(email);
//             localStorage.removeItem(dataName);
//             setSurveyValues(response);
//             // track the order encharge

//             // console.warn(tracked)
//             //console.log(tracked!='yes');
//             callDataLayer(response);
//             if (tracked != 'yes') {
//                 callEncharge(response);
//                 //gr('track', 'conversion', { email:email });
//                 sendToReditus(order_id, email);
//             }
//             //console.warn('lets send');
//             //gr('track', 'conversion', { email:email });
//         },
//         error: function (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Oops...',
//                 text: 'Could not find the order',
//                 footer: '<a href="mailto:hello@startfleet.io">Please contact us.</a>',
//             });
//         },
//     });
// }

//
$(function () {
    localStorage.removeItem(dataName);
    displayOrderInfo();
    // getOrderInformation();
});

function setSurveyValues(response) {
    window.qwarySettings = {
        surveyId: '3Y6A066rNaDrV17TDvQBN1ILBa5a-X3XYqFdbdB9zJQ=',
        popupHeight: '600px',
        popupWidth: '100%',
        layout: 'inline',
        container: 'qwary-widget',
        contact: {
            email: response.email,
            firstName: response.full_name.split(' ')[0],
            lastName: response.full_name.split(' ')[1],
            // // streetAddress : ‘<%= contact street address %>‘,
            // // city : ‘<%= contact city %>‘,
            // // country: ‘<%= contact country %>‘,
            // // state: ‘<%= contact state %> ‘,
            // // postalCode: ‘<%= contact postal code %>‘,
            // // department: ‘<%= contact department %>‘,
            phoneNumber: response.phone,
        },
    };

    //console.warn(window.qwarySettings);
    window.qwary.survey();
}

function callDataLayer(form_data) {
    const products = [];
    const { phone, email, full_name, order_id, totalCost, items } = form_data;

    items.forEach((item, index) => {
        let val = {
            name: item.item_name, // Name or ID is required.
            id: item.merchandise_id,
            price: item.item_price,
            //'brand': 'Google',
            category: item.item_type,
            //'variant': 'Gray',
            quantity: 1,
            coupon: '',
        };

        products.push(val);
    });

    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: 'transaction',
        ecommerce: {
            currencyCode: 'USD',
            purchase: {
                actionField: {
                    id: order_id, // Transaction ID. Required for purchases and refunds.
                    affiliation: 'Startfleet Store',
                    revenue: totalCost, // Total transaction value (incl. tax and shipping)
                    tax: '0.00',
                    // 'shipping': '0.00',
                    coupon: '',
                    currency: 'USD',
                },
                products: products,
            },
        },
    });
    console.log(form_data);
}

function sendToReditus(order_id, email) {
    gr('track', 'conversion', { email: email });
    console.log('sending too reditus');
    setTimeout(() => {
        $.ajax({
            url: API_ORDER_REDITUS,
            type: 'POST',
            data: { order_id },
            dataType: 'JSON',
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            },
        });
    }, 5000);
}
