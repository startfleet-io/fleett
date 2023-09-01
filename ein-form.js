var tripetto = TripettoServices.init({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQWNaSHVwTDlrWjNzR0ZlQXVvZWRvdGV3ZE9udzRJb3BEMXVJNUdWbFRiYz0iLCJkZWZpbml0aW9uIjoibnJvaFk1bXhCVU1US0lUTnQwenJCM01iVm14N3Z5aXhaRWpSb0pOaE15MD0iLCJ0eXBlIjoiY29sbGVjdCJ9.euuacoZnqukVKJfZveGbsmW3fFEM_iJtMIeEZFT6Ic8" });

TripettoClassic.run({
    element: document.getElementById("tripetto"),
    definition: tripetto.definition,
    styles: tripetto.styles,
    l10n: tripetto.l10n,
    locale: tripetto.locale,
    translations: tripetto.translations,
    attachments: tripetto.attachments,
    onSubmit: function(instance) {
        // TODO: Handle the results
        // For example retrieve the results as a CSV-file:
        var csv = TripettoRunner.Export.CSV(instance);
        // Or retrieve the individual fields:
        var fields = TripettoRunner.Export.fields(instance);
        
        
        
        var { fields } = fields;
        var form_data = {  };
       
        var arr = new Array();

        fields.forEach((item) => {
            arr.push({ name: item.name, value:item.value});
            //console.warn(`name : ${item.name}, value: ${item.value} `)

            if((item.value!=='' && 
            item.value!== undefined) && 
            item.name.indexOf(' ') <= 0 && (item.value != false || item.value!='false'))
                form_data[item.name] = item.value
        })
        console.table(arr);
        if(form_data["section_4"] !== "own_address") {

            if(form_data['state'].toLowerCase() == 'delaware') {

                form_data['4a_mailingAddress'] = '8 The Green STE R'
                form_data['4b_cityStateZip'] = 'Dover, DE 19901'
                form_data['6_countyState'] = 'Kent County, DE'

            }else if(form_data['state'].toLowerCase() == 'wyoming') {

                form_data['4a_mailingAddress'] = '30 N Gould St Ste R'
                form_data['4b_cityStateZip'] = 'Sheridan, WY 82801'
                form_data['6_countyState'] = 'Sheridan County, WY'

            }else if(form_data['state'].toLowerCase() == 'california') {

                form_data['4a_mailingAddress'] = '1401 21st ST STE R'
                form_data['4b_cityStateZip'] = 'Sacramento, CA 95811'
                form_data['6_countyState'] = 'Sacramento County'

            }else if(form_data['state'].toLowerCase() == 'michigan') {

                form_data['4a_mailingAddress'] = '2222 WEST GRAND RIVER AVE STE A'
                form_data['4b_cityStateZip'] = 'OKEMOS, MI 48864'
                form_data['6_countyState'] = 'Ingham County'

            }else if(form_data['state'].toLowerCase() == 'colorado') {

                form_data['4a_mailingAddress'] = '1942 BROADWAY STREET, STE 314C'
                form_data['4b_cityStateZip'] = 'BOULDER, CO 80302'
                form_data['6_countyState'] = 'Boulder County'

            }else if(form_data['state'].toLowerCase() == 'new mexico') {
                
                form_data['4a_mailingAddress'] = '2201 MENAUL BLVD NE STE A'
                form_data['4b_cityStateZip'] = 'ALBUQUERQUE, NM 87107'
                form_data['6_countyState'] = 'Bernalillo county, New Mexico'

            }else if(form_data['state'].toLowerCase() == 'texas') {
                
                form_data['4a_mailingAddress'] = '5900 Balcones Drive STE 100'
                form_data['4b_cityStateZip'] = 'Austin, TX 78731'
                form_data['6_countyState'] = 'Travis County'
                
            }else if(form_data['state'].toLowerCase() == 'nevada') {
                
                form_data['4a_mailingAddress'] = '401 Ryland St. STE 200-A'
                form_data['4b_cityStateZip'] = 'Reno, NV 89502'
                form_data['6_countyState'] = 'Washoe County'
                
            }else if(form_data['state'].toLowerCase() == 'new jearsy') {
                
                form_data['4a_mailingAddress'] = 'FIVE GREENTREE CENTRE 525 ROUTE 73 NORTH STE 104'
                form_data['4b_cityStateZip'] = 'MARLTON, NJ 08053'
                form_data['6_countyState'] = 'Burlington County'
                
            }else {

                form_data['4a_mailingAddress'] = '7901 4th St N STE 300'
                form_data['4b_cityStateZip'] = 'St. Petersburg, FL 33702'
                form_data['6_countyState'] = 'Pinellas County, FL'
            }

        }else {


                form_data['4b_cityStateZip'] = `${form_data['4bcity']}, ${form_data['4bstate']} ${form_data['4bzip']}`
                form_data['6_countyState'] = `${form_data['6county']} ${form_data['6state']} `
        }

        form_data['14_under1000TaxLiability'] = form_data['14_under1000TaxLiability'] == 'Yes' ? true : false

        if(form_data['section_16'] !='16_other') {
            let name = form_data['section_16'];
            form_data[name] = true;
        }else {
            form_data['16_other'] = true;
        }
        form_data['18_appliedEinBefore'] = false
        form_data['18_neverAppliedEinBefore'] = true

        if(form_data['11_dateStarted']) {

            let dateStarted = new Date(form_data['11_dateStarted']);
            let month = (dateStarted.getMonth()+1) <= 9 ? `0${(dateStarted.getMonth()+1)}` : (dateStarted.getMonth()+1);
            let day = dateStarted.getDate() <= 9 ? `0${dateStarted.getDate()}` : dateStarted.getDate();

            form_data['11_dateStarted'] = `${month}/${day}/${dateStarted.getFullYear()}`

        }

        if(form_data['section_10']) {

            if(form_data['section_10'] !='10_other') {

                let name = form_data['section_10'];
                form_data[name] = true;

                if(name == '10_startedBusiness') {
                    //form_data['10_startedBusiness']
                }


            }else {
                form_data['10_other'] = true;
            }
        }
        if(!form_data['7b_ssnItinEin']) {
            form_data['7b_ssnItinEin'] = 'FOREIGN';
        }
				
        if(form_data['8a_isLLC']) {
            delete form_data['8a_isNotLLC']
        }

        if(!form_data['8a_isLLC']) {
             delete form_data['8a_isLLC']
             form_data['8a_isNotLLC'] = true
        }
        
        if(form_data['18_appliedEinBefore']) {
            delete form_data['18_neverAppliedEinBefore']
        }

        if(!form_data['18_appliedEinBefore']) {
            delete form_data['18_appliedEinBefore']
             form_data['18_neverAppliedEinBefore'] = true
        }
        
        if(!form_data['14under1000TaxLiability']) {
            delete form_data['14under1000TaxLiability']
        }

        if(!form_data['14_under1000TaxLiability']) {
            delete form_data['14_under1000TaxLiability']
        }
        
        if(!form_data['9a_corporation']) {
        	delete form_data['9a_corporationText']
          delete form_data['9a_corporation']
        }
        if(!form_data['9a_partnership']) {
        	delete form_data['9a_partnership']
        }
        if(!form_data['9a_other']) {
        	delete form_data['9a_other']
          delete form_data['9a_otherText']
     
        }
        if(form_data['9a_corporationText'] == "False") {
        	delete form_data['9a_corporationText']
        }
        
        if(form_data['7a_responsibleParty'] && 
        form_data['7a_responsibleParty']!=='') {
        	form_data['7a_responsibleParty'] = form_data['7a_responsibleParty'].toUpperCase();
        }
    
    console.warn('posting data')
    console.warn('--------------------')
    console.warn(form_data);
    // throw 'err';
     $.ajax({

            url:"https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/ein_form_submission",
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
function init() {
  
    let coldStop = getParameterByName('coldStop')
    let orderID = getParameterByName('orderId')
    let pstate = getParameterByName('state')
    let pstructure = getParameterByName('structure')
   	
    let cName = getParameterByName('applicantName')
    let aEmail = getParameterByName('applicantEmail')
    let aPhone = getParameterByName('applicantPhone')
    
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

            url:"https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/orderInfo",
            type:"POST",
            data:{orderID} ,
            dataType:"JSON",
            success:function(response) {
              
                const { company_name, 
                        company_state, 
                        company_structure, 
                        company_suffix,
                        purchase_order_id,
                        full_name,
                        email,
                        phone
                    } = response;

                let structure;
                if(company_structure.toLowerCase() == 'corporation') {
                    structure = 'Corporation'
                }else {
                    structure = 'LLC'
                }
                localStorage.setItem('orderId',purchase_order_id)
                localStorage.setItem('state',company_state)
                localStorage.setItem('structure',structure)
                 let ucfirst_company_name = company_name.charAt(0).toUpperCase() + company_name.slice(1);

                search_params.set('companyName',`${ucfirst_company_name} ${company_suffix}`)
               
                search_params.set('state',company_state)
                search_params.set('structure',structure)
                search_params.set('suffix',company_suffix)
                
                search_params.set('applicantName',full_name)
                search_params.set('applicantEmail',email)
                search_params.set('applicantPhone',phone)
                
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
    }
}
init();