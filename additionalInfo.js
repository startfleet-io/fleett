var version,source;
var API_BASE = `https://xe5a-injf-5wxp.n7.xano.io`;
var API_GET_ORDER_INFO;
var API_POST_MORE_INFO;


function setUpTestEnv() {

     version = getParameterByName('v')
     source  = getParameterByName('source')

    if(version && source) {

      API_VERSION = `:v${version}`;
      API_GET_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/orderInfo`
      API_POST_MORE_INFO = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/tripetto_form`
      
      $.ajaxSetup({
      beforeSend: function (xhr)
      {
       xhr.setRequestHeader("X-Data-Source","test");
      
      }
    });
      
      console.warn('test mode')
    }else {

      API_GET_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ/orderInfo`
      API_POST_MORE_INFO = `${API_BASE}/api:z9NOXVAQ/tripetto_form`
      console.warn('live mode')
    }
  }

TripettoClassic.run({
    element: document.getElementById("tripetto"),
    definition: tripetto.definition,
    styles: tripetto.styles,
    l10n: tripetto.l10n,
    locale: tripetto.locale,
    translations: tripetto.translations,
    attachments: tripetto.attachments,
    //onSubmit: tripetto.onSubmit
    onSubmit: function(instance) {
        // TODO: Handle the results
        // For example retrieve the results as a CSV-file:
        var csv = TripettoRunner.Export.CSV(instance);
        // Or retrieve the individual fields:
        var fields = TripettoRunner.Export.fields(instance);

        var structure        = getParameterByName('structure'); // "structure"

        let version = getParameterByName('v')
        let source  = getParameterByName('source')

        var form_data = {  };

        form_data.test = false;

        if(version && source) {

            form_data.test = true;
        }

        var { fields } = fields;
        
       
        form_data.company_name = fields.filter((item)=> item.name == "company_name")[0].value;

        form_data.orderId = fields.filter((item)=> item.name == "orderId")[0].value;

        form_data.state = fields.filter((item)=> item.name == "state")[0].value;

        form_data.structure = fields.filter((item)=> item.name == "structure")[0].value;

        form_data.suffix = fields.filter((item)=> item.name == "suffix")[0].value;

        form_data.company_industry = fields.filter((item)=> item.name == "company_industry")[0].value;

        form_data.company_description = fields.filter((item)=> item.name == "company_description")[0].value;


        if (structure.toLowerCase() == 'corporation') {

            // console.error('insdie corporation');

         form_data.name_of_president = fields.filter((item)=> item.name == "name_of_president")[0].value;

         form_data.name_of_ceo = fields.filter((item)=> item.name == "name_of_ceo")[0].value;

         form_data.name_of_cfo = fields.filter((item)=> item.name == "name_of_cfo")[0].value;

         form_data.name_of_secretary = fields.filter((item)=> item.name == "name_of_secretary")[0].value;

          form_data.num_of_authorized_shares = fields.filter((item)=> item.name == "num_of_authorized_shares")[0].value;

          form_data.par_value_of_share = fields.filter((item)=> item.name == "par_value_of_share")[0].value;

        } else {

          form_data.num_of_members = fields.filter((item)=> item.name == "num_of_members")[0].value;
          form_data.members = new Array();
          
           
          fields
          .filter((item)=> item.name == 'num_of_members / legal_member_name')
          .map((item,index)=> {
           
           if(form_data.num_of_members > index) {

                form_data.members.push({legal_member_name:'',ownership_percentage:''})
                //console.warn(index)
                //console.warn(item)
                form_data.members[index].legal_member_name = item.value
            }

          })

          fields
          .filter((item)=> item.name == 'num_of_members / ownership_percentage')
          .map((item,index)=> {
           
           if(form_data.num_of_members > index) {
                //console.warn(index)
                //console.warn(item)
                form_data.members[index].ownership_percentage = item.value
            }

          })

        }
		console.log('submitting...');
        console.warn(form_data);
        $.ajax({

            url:API_POST_MORE_INFO,
            type:"POST",
            data:{form_data} ,
            dataType:"JSON",
            success:function(resonse) {

            },
            error:function( error ) {

             }

          })
        return false;

    }
});
// extract query string
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function init() {
  

    setUpTestEnv();

    let coldStop = getParameterByName('coldStop')
    let orderID = getParameterByName('orderId')
    let pstate = getParameterByName('state')
    let pstructure = getParameterByName('structure')
   

    let savedState = localStorage.getItem('state') ?? ''
    let savedStructure = localStorage.getItem('structure') ?? ''
    let savedOrderId = localStorage.getItem('orderId') ?? 0

    if(coldStop =='' || 
        !coldStop || 
        coldStop!='yes' || 
        savedOrderId!=orderID ||
        savedState != pstate ||
        savedStructure!=pstructure
        ) {
     let url = new URL(window.location.href);
     let search_params = url.searchParams;

      $.ajax({

            url:API_GET_ORDER_INFO,
            type:"POST",
            data:{orderID} ,
            dataType:"JSON",
            success:function(response) {
              
                const { company_name, 
                        company_state, 
                        company_structure, 
                        company_suffix,
                        purchase_order_id
                    } = response;

                let structure;
                if(company_structure.toLowerCase() == 'corporation') {
                    structure = 'Corporation'
                }else {
                    structure = 'LLC'
                }
                localStorage.setItem('orderId',purchase_order_id)
                localStorage.setItem('state',capitalizeFirstLetter(company_state))
                localStorage.setItem('structure',structure)
                search_params.set('companyName',capitalizeFirstLetter(company_name))
                search_params.set('state',capitalizeFirstLetter(company_state))
                search_params.set('structure',structure)
                search_params.set('suffix',company_suffix)
                search_params.set('coldStop','yes')
                window.history.pushState({path:url.href},'',url.href);
                window.location = window.location;
            },
            error:function( error ) {
               
                 Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Sorry order not found',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false
                })
             }

          })
    }else {
            var structure = getParameterByName('structure');
            if(structure.toLowerCase() == 'corporation') {
              structure = 'Corporation';
            }else {
              structure = 'LLC';
            }
            let txt = $("#dynamic-heading").text();
            txt = `${txt} ${structure}`;
            $("#dynamic-heading").text(txt)
    }

  
}
init();