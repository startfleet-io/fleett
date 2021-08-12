$(function () {
  let companyType = $('#companyType');
  let companyState = $('#companyCity');
  let FeeText = $('.feetext');
  let stateFee = $('.statefee');
  stateFee.html('$100');
  let feeString = '';
  let stateNumber = 0;
  let company = '';
  let state = '';
  let dt = null;
  let plans = null;
  let formationItems = null;
  let complianceItems = null;
  let growthItems = null;
  let Addons = null;
  let corvetteAddOnFee = 0;
  let frigateAddOnFee = 0;
  let cruiserAddOnFee = 0;
  let covertteTotal = 0;
  let frigateTotal = 0;
  let cruiserTotal = 0;
  let trueFrigateprice = 0;
  let trueCruiserprice = 0;
  let CoverteeMb = $('#CoverteeMb');
  let FrigateMb = $('#FrigateMb');
  let CruiserMb = $('#CruiserMb');
  let AddonsMb = $('#AddonsMb');
  // let frigateProducts = [1002,1009,1010,1025];
  // let cruiserproducts = [1002,1009,1010,1025,1015,1016,1024];
  let frigateProducts = [1002,1009,1010,1025,1028,1012];
  let cruiserproducts = [1002,1009,1010,1025,1024,1021,1028,1012];
  let productList;

  let frigatePlanPrice = 0;
  let cruiserPlanPrice = 0;

  let corvetteBasePrice = 0;
  let frigateBasePrice = 0;
  let cruiserBasePrice = 0;

  let frigateSavePrice = 0;
  let cruiserSavePrice = 0;

  let frigateSaving = $("#frigateSaving");
  let cruiserSaving = $("#cruiserSaving");

  var without_product_url = 'order?';
  var with_product_url = 'order?';

  var url_products = {};

  var yearly_text = 'yearly'
  var monthly_text = 'monthly'
  var onetime_text = 'onetime'

  function displayCell( params ) {

    let numberPlan = 0;
    let price = parseInt(params.price) + parseInt(params.item['setup_fee']);

let cell = `<input class="mr-5 priceBox" type="checkbox" data-plan="${params.plan}" data-price="${
            price
          }"  id="${params.item['id']}" data-ref="${params.item['refcode']}" />`; 

            let payment_type_text = params.payment_type.charAt(0).toUpperCase() + params.payment_type.slice(1);

            if(params.item['setup_fee'] > 0 && params.payment_type == yearly_text) {

              numberPlan++

              cell+= `<span class="first-plans">$${params.item['setup_fee']}<sub class="label-yearly">Setup</sub></span>`;

              cell+= `<span class="second-plans">+ $${params.price}<sub class="label-add-setup">${payment_type_text}</sub></span>`
            }

             if(params.item['setup_fee'] > 0 && params.payment_type == monthly_text) {

              numberPlan++

            cell+= `<span class="first-plans">$${params.item['setup_fee']}<sub class="label-yearly">Setup</sub></span>`;

            cell+= `<span class="second-plans">+ $${params.price}<sub class="label-add-setup">${payment_type_text}</sub></span>`
            }

            if(params.payment_type == yearly_text && params.item['setup_fee'] <= 0) {
            cell+= `<span class="single-plans"> $${params.price} <sub class="label-yearly">${payment_type_text}</sub></span>`;
            }

            if(params.payment_type == monthly_text && params.item['setup_fee'] <= 0) {
             cell+=`<span class="single-plans"> $${params.price} <sub class="label-monthly">${payment_type_text}</sub></span>`;
            }
            if(params.payment_type == onetime_text && params.item['setup_fee'] <= 0) {
             cell+=`<span class="without-label"> $${params.price}</span>`;
            }

                if(numberPlan) {
                  return `<div class="tb 2-plans">${cell}</div>`;
                }else {

                  return `<div class="tb">${cell}</div>`;
                }
         
  }

  $.get(`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/pricing`,{},async function(data, textStatus, jqXHR) {

    const { plans, state_fess, products } = data;

      productList = _.sortBy(products, 'order'); 

     
      // plans

      let x = plans.filter((p)=> p.name.toLowerCase() == 'corvette')[0];
      let y = plans.filter((p)=> p.name.toLowerCase() == 'frigate')[0];
      let z = plans.filter((p)=> p.name.toLowerCase() == 'cruiser')[0];

     // let [x, y, z] = plans;


      var badge = '<div id="wrapper-img-featured-label" class="img-featured-plans">';
      badge+='<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/610154cc329673a834f01bed_featured-label-new.svg" loading="lazy" id="img-featured-label" alt="" class="image-21">';
      badge+='</div>';

      let featuredPlan = plans.filter((p)=> p.is_featured == "true");
      let featuredName = featuredPlan[0].name;
      let el = $(`[data-id='${featuredName.toLowerCase()}']`);
      el.addClass("custom-featured-plans");
      el.addClass("bg-card-dark");
      el.find(".check-grid-large-gap").addClass("white-text")
      el.prepend(badge);
      el.find(".pricing-card-title").addClass("title-pricing-card-pricing-white");

        
      // dynamic plan price

      $('#coverttePrice').html('$' + x.price);
      $('#frigatePrice').html('$' + y.price);
      $('#cruiserPrice').html('$' + z.price);


      covertteTotal += x.price + 100;

      // base price of corvette
      corvetteBasePrice = covertteTotal;

      frigateTotal += y.price + 100;

      // base price of frigate
      frigateBasePrice = frigateTotal;
      
      cruiserTotal += z.price + 100;

      // base price of cruiser

      cruiserBasePrice = cruiserTotal;

      $('#frigateTotal').html('$' + frigateTotal);
      $('#covertteTotal').html('$' + covertteTotal);
      $('#cruiserTotal').html('$' + cruiserTotal);

      // state fees

      dt = state_fess;


      formationItems = await productList
        .filter((item) => (item.category == 'formation' && item.is_hide==false));

        formationItems = _.sortBy(formationItems, 'order');

      formationItems.forEach((item, index) => {

    
        let corvette = null;
        let frigate = null;
        let cruiser = null;
        let payment_type = item['payment_type'];

        if (
          Boolean(item['included_in_corvette']) == true &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_corvette']) == false &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'corvette',
            price:item['corvette_price'],
            payment_type,
            item
          }

          corvette = displayCell( params );

          // corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
          //   item['corvette_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['corvette_price'] + ' ' + payment_type
          //     : item['corvette_price']
          // } `;
        }
        if (Boolean(item['included_in_frigate']) == true && item['frigate_price'] == 0) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_frigate']) == false &&
          item['frigate_price'] <= 0
        ) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'frigate',
            price:item['frigate_price'],
            payment_type,
            item
          }

          frigate = displayCell( params );

          // frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
          //   item['frigate_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['frigate_price'] + ' ' + payment_type
          //     : item['frigate_price']
          // } `;
        }
        if (Boolean(item['included_in_cruiser']) == true && item['cruiser_price'] == 0) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_cruiser']) == false &&
          item['cruiser_price'] <= 0
        ) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

           let params = {
            plan:'cruiser',
            price:item['cruiser_price'],
            payment_type,
            item
          }

          cruiser = displayCell( params );

          // cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser" data-price="${
          //   item['cruiser_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['cruiser_price'] + ' ' + payment_type
          //     : item['cruiser_price']
          // } `;
        }

        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#GridFormation').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="javascript:;" class="help w-inline-block show-desc"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center">${corvette}</div><div class="pricing-table-cell cell-center">${frigate}</div><div class="pricing-table-cell cell-center">${cruiser}</div></div>`,
        );

        $('#FormationCovertte')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
                                    <h4 class="pricing-cell-title text-white">${item.name}</h4>
                                </div>
                                <div class="pricing-table-cell mcell rightcell">
                                    <div class="mcheckcontainer">
                                    ${corvette}
                                    </div>
                                </div></div>`);
        $('#FormationFrigate')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
    </div>
    <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${frigate}
        </div>
    </div></div>`);
        $('#FormationCruiser')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
  <h4 class="pricing-cell-title text-white">${item.name}</h4>
</div>
<div class="pricing-table-cell mcell rightcell">
  <div class="mcheckcontainer">
  ${cruiser}
  </div>
</div></div>`);
      });
      complianceItems = productList
        
        .filter((item) => (item.category == 'compliance' && item.is_hide==false));
      //console.log('compliance items', complianceItems);
      
      complianceItems = _.sortBy(complianceItems, 'order');

      complianceItems.forEach((item, index) => {

       

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        let payment_type = item['payment_type'];
        if (
          Boolean(item['included_in_corvette']) == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_corvette']) == false &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'corvette',
            price:item['corvette_price'],
            payment_type,
            item
          }

          corvette = displayCell( params );

          // corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
          //   item['corvette_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['corvette_price'] + ' ' + payment_type
          //     : item['corvette_price']
          // } `;
        }
        if (Boolean(item['included_in_frigate']) == true && item['frigate_price'] == 0) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_frigate']) == false &&
          item['frigate_price'] <= 0
        ) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'frigate',
            price:item['frigate_price'],
            payment_type,
            item
          }

          frigate = displayCell( params );

          // frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
          //   item['frigate_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['frigate_price'] + ' ' + payment_type
          //     : item['frigate_price']
          // } `;
        }
        if (Boolean(item['included_in_cruiser']) == true && item['cruiser_price'] == 0) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_cruiser']) == false &&
          item['cruiser_price'] <= 0
        ) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'cruiser',
            price:item['cruiser_price'],
            payment_type,
            item
          }

          cruiser = displayCell( params );

          // cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
          //   item['cruiser_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['corvette_price'] + ' ' + payment_type
          //     : item['cruiser_price']
          // } `;
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#gridCompliance').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="javascript:;" class="help w-inline-block show-desc"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center">${corvette}</div><div class="pricing-table-cell cell-center">${frigate}</div><div class="pricing-table-cell cell-center">${cruiser}</div></div>`,
        );
        $('#ComplianceCovertte')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${corvette}
        </div>
      </div></div>`);

        $('#ComplianceFrigate')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${frigate}
        </div>
      </div></div>`);
        $('#ComplianceCruiser')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${cruiser}
        </div>
      </div></div>`);
      });
      growthItems = productList
        
        .filter((item) => (item.category == 'growth' && item.is_hide==false));
      
        growthItems = _.sortBy(growthItems, 'order'); 

      growthItems.forEach((item, index) => {

        

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        let payment_type = item['payment_type'];
        if (
          Boolean(item['included_in_corvette']) == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_corvette']) == false &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

           let params = {
            plan:'corvette',
            price:item['corvette_price'],
            payment_type,
            item
          }

          corvette = displayCell( params );

          // corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
          //   item['corvette_price']
          // }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['corvette_price'] + ' ' + payment_type
          //     : item['corvette_price']
          // } `;


        }
        if (Boolean(item['included_in_frigate']) == true && item['frigate_price'] == 0) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_frigate']) == false &&
          item['frigate_price'] <= 0
        ) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

           let params = {
            plan:'frigate',
            price:item['frigate_price'],
            payment_type,
            item
          }

          frigate = displayCell( params );

          // frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
          //   item['frigate_price']
          // }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['frigate_price'] + ' ' + payment_type
          //     : item['frigate_price']
          // } `;
        }
        if (Boolean(item['included_in_cruiser']) == true && item['cruiser_price'] == 0) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_cruiser']) == false &&
          item['cruiser_price'] <= 0
        ) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'cruiser',
            price:item['cruiser_price'],
            payment_type,
            item
          }

          cruiser = displayCell( params );

          // cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
          //   item['cruiser_price']
          // }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //   payment_type == yearly_text ||
          //   payment_type == monthly_text
          //     ? item['cruiser_price'] + ' ' + payment_type
          //     : item['cruiser_price']
          // } `;
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';
        $('#gridGrowth').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="javascript:;" class="help w-inline-block show-desc"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center">${corvette}</div><div class="pricing-table-cell cell-center">${frigate}</div><div class="pricing-table-cell cell-center">${cruiser}</div></div>`,
        );
        $('#OperationCovertte')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${corvette}
        </div>
      </div></div>`);
        $('#OperationFrigate')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${frigate}
        </div>
      </div></div>`);
        $('#OperationCruiser')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
        <h4 class="pricing-cell-title text-white">${item.name}</h4>
      </div>
      <div class="pricing-table-cell mcell rightcell">
        <div class="mcheckcontainer">
        ${cruiser}
        </div>
      </div></div>`);
      });
      Addons = productList
        .filter((item) => (item.category == 'addons' && item.is_hide==false));
      
      Addons = _.sortBy(Addons, 'order'); 

      Addons.forEach((item, index) => {

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        let payment_type = item['payment_type'];
        if (
          Boolean(item['included_in_corvette']) == true &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_corvette']) == false &&
          item['corvette_price'] <= 0
        ) {
          corvette =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

           let params = {
            plan:'corvette',
            price:item['corvette_price'],
            payment_type,
            item
          }

          corvette = displayCell( params );

          // if (item['setup_fee'] == 0) {
          //   corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
          //     item['corvette_price']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['corvette_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? item['setup_fee'] +
          //         ' <span>setup</span> ' +
          //         '$' +
          //         item['corvette_price'] +
          //         payment_type
          //       : item['corvette_price']
          //   } `;
          // } else {
          //   corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
          //     item['corvette_price'] + item['setup_fee']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['corvette_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? '<span class="setup_fee">' +
          //         item['setup_fee'] +
          //         ' setup</span> ' +
          //         '<span class="monthly-fee">+ $' +
          //         item['corvette_price'] +
          //         ' ' +
          //         payment_type +
          //         '</span>'
          //       : item['corvette_price']
          //   } `;
          // }
        }
        if (Boolean(item['included_in_frigate']) == true && item['frigate_price'] == 0) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_frigate']) == false &&
          item['frigate_price'] <= 0
        ) {
          frigate =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

           let params = {
            plan:'frigate',
            price:item['frigate_price'],
            payment_type,
            item
          }

          frigate = displayCell( params );

          // if (item['setup_fee'] == 0) {
          //   frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
          //     item['frigate_price']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['frigate_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? item['setup_fee'] +
          //         ' <span>setup</span> ' +
          //         '$' +
          //         item['frigate_price'] +
          //         payment_type
          //       : item['frigate_price']
          //   } `;
          // } else {
          //   frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
          //     item['frigate_price'] + item['setup_fee']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['frigate_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? '<span class="setup_fee">' +
          //         item['setup_fee'] +
          //         ' setup</span> ' +
          //         '<span class="monthly-fee">+ $' +
          //         item['frigate_price'] +
          //         ' ' +
          //         payment_type +
          //         '</span>'
          //       : item['frigate_price']
          //   } `;
          // }
        }
        if (Boolean(item['included_in_cruiser']) == true && item['cruiser_price'] == 0) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check"></div>';
        } else if (
          Boolean(item['included_in_cruiser']) == false &&
          item['cruiser_price'] <= 0
        ) {
          cruiser =
            '<div class="tb"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check"></div>';
        } else {

          let params = {
            plan:'cruiser',
            price:item['cruiser_price'],
            payment_type,
            item
          }

          cruiser = displayCell( params );

          // if (item['setup_fee'] == 0) {
          //   cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
          //     item['cruiser_price']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['cruiser_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? item['setup_fee'] +
          //         ' <span>setup</span> ' +
          //         '$' +
          //         item['cruiser_price'] +
          //         payment_type
          //       : item['cruiser_price']
          //   } `;
          // } else {
          //   cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
          //     item['cruiser_price'] + item['setup_fee']
          //   }" id="${item._id}" data-ref="${item['refcode']}" /> $${
          //     payment_type == yearly_text
          //       ? item['cruiser_price'] + ' ' + payment_type
          //       : payment_type == monthly_text
          //       ? '<span class="setup_fee">' +
          //         item['setup_fee'] +
          //         ' setup</span> ' +
          //         '<span class="monthly-fee">+ $' +
          //         item['cruiser_price'] +
          //         ' ' +
          //         payment_type +
          //         '</span>'
          //       : item['cruiser_price']
          //   } `;
          // }
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#Addons').prepend(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="javascript:;" class="help w-inline-block show-desc"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center">${corvette}</div><div class="pricing-table-cell cell-center">${frigate}</div><div class="pricing-table-cell cell-center">${cruiser}</div></div>`,
        );
        $('#AddonConvertte')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
            <h4 class="pricing-cell-title text-white">${item.name}</h4>
          </div>
          <div class="pricing-table-cell mcell rightcell">
            <div class="mcheckcontainer">
            ${corvette}
            </div>
          </div></div>`);
        $('#AddonFrigate')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
            <h4 class="pricing-cell-title text-white">${item.name}</h4>
          </div>
          <div class="pricing-table-cell mcell rightcell">
            <div class="mcheckcontainer">
            ${frigate}
            </div>
          </div></div>`);
        $('#AddonCruiser')
          .append(`<div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow ${alternate}"><div class="pricing-table-cell mcell">
            <h4 class="pricing-cell-title text-white">${item.name}</h4>
          </div>
          <div class="pricing-table-cell mcell rightcell">
            <div class="mcheckcontainer">
            ${cruiser}
            </div>
          </div></div>`);
        // $("#AddonsMb").prepend(`<div data-w-tab="Tab 7" id="AddonsMb" class="tab-pane-2 w-tab-pane w--tab-active" role="tabpanel" aria-labelledby="w-tabs-0-data-w-tab-3"><div id="FormationMb" class="category-title"><h5>Formation</h5></div><div id="covertteM" class="w-layout-grid pricing-grid-mobile mrow"><div class="pricing-table-cell mcell"><h4 class="pricing-cell-title text-white">Fast Filing<br></h4></div><div class="pricing-table-cell mcell rightcell"><div class="mcheckcontainer"><img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/60e439b8e0c58b2bce4968e3_Icon%20awesome-check.png" loading="lazy" alt="" class="check"></div><div class="mbprice">$5</div></div></div></div>`);
      });

        // frigate saving
    
       if(frigateProducts.length) {
        frigateProducts.forEach((fp)=>{

          let refPrice = productList.filter((item)=> item.refcode == fp);
           frigatePlanPrice+= parseInt(refPrice[0].corvette_price);
          })

           trueFrigateprice = parseInt(corvetteBasePrice) + parseInt(frigatePlanPrice)

           frigateSavePrice = parseInt(trueFrigateprice) - parseInt(frigateBasePrice);

           frigateSaving.html(`Save $${frigateSavePrice}`);

        }

        // cruiser saving 
        if(cruiserproducts.length) {

          cruiserproducts.forEach((cp)=>{
          let refPrice = productList.filter((item)=> item.refcode == cp);
           cruiserPlanPrice+= parseInt(refPrice[0].corvette_price);
          })
          trueCruiserprice = parseInt(corvetteBasePrice) + parseInt(cruiserPlanPrice);
           cruiserSavePrice = parseInt(trueCruiserprice) - parseInt(cruiserBasePrice);

           cruiserSaving.html(`Save $${cruiserSavePrice}`);

        }
  });

  $('select').on('change', function () {
    state = companyState.val();
    company = companyType.val();
    if (state == '' || company == '') return;

    let found = dt.find(function (elm) {
      return (
        elm.structure.toLowerCase() == company.toLowerCase() &&
        elm.state.toLowerCase() == state.toLowerCase()
      );
    });
    //console.log(found);
    let em = 'Plus $' + found.fee + ' ' + found.state + ' fee';
    console.log(em);
    FeeText.html(em);
    stateFee.html('$' + found.fee);

    covertteTotal = corvetteBasePrice-100;
    covertteTotal += found.fee;
    $('#covertteTotal').html('$' + covertteTotal);

    frigateTotal = frigateBasePrice-100;
    frigateTotal += found.fee;
    $('#frigateTotal').html('$' + frigateTotal);

    cruiserTotal = cruiserBasePrice-100;
    cruiserTotal += found.fee;
    $('#cruiserTotal').html('$' + cruiserTotal);


  });



  $('.grid-pricing').on('click', '.priceBox', function () {
    if (this.checked) {
      let planName = $(this).data('plan');
      let planPrice = $(this).data('price');
      let productRef = $(this).data('ref');

      if(!url_products[planName]) {

        url_products[planName] = []
        url_products[planName].push({
          productRef
        })
      }else {

        url_products[planName].push({
          productRef
        })

      }
      console.log(url_products);

      if (planName == 'corvette') {

        
        corvetteAddOnFee += parseInt(planPrice);
        $('#corvetteAddOn').html('$' + parseInt(corvetteAddOnFee));
        covertteTotal += parseInt(planPrice);
        $('#covertteTotal').html('$' + parseInt(covertteTotal));
      } else if (planName == 'frigate') {
        frigateAddOnFee += parseInt(planPrice);
        $('#frigateAddOn').html('$' + frigateAddOnFee);
        frigateTotal += parseInt(planPrice);
        $('#frigateTotal').html('$' + frigateTotal);
      } else if (planName == 'cruiser') {
        cruiserAddOnFee += parseInt(planPrice);
        $('#cruiserAddOn').html('$' + cruiserAddOnFee);
        cruiserTotal += parseInt(planPrice);
        $('#cruiserTotal').html('$' + cruiserTotal);
      }
    } else {
      let planName = $(this).data('plan');
      let planPrice = $(this).data('price');
      let productRef = $(this).data('ref');

      if(url_products[planName]) {

        url_products[planName] = url_products[planName].filter((item)=> item.productRef !== productRef)
      }

      if (planName == 'corvette') {
        if (corvetteAddOnFee < 0) {
          corvetteAddOnFee = 0;
          return;
        }
        corvetteAddOnFee -= parseInt(planPrice);
        $('#corvetteAddOn').html('$' + parseInt(corvetteAddOnFee));
        covertteTotal -= parseInt(planPrice);
        $('#covertteTotal').html('$' + parseInt(covertteTotal));
      } else if (planName == 'frigate') {
        if (frigateAddOnFee < 0) {
          frigateAddOnFee = 0;
          return;
        }
        frigateAddOnFee -= parseInt(planPrice);
        $('#frigateAddOn').html('$' + parseInt(frigateAddOnFee));
        frigateTotal -= parseInt(planPrice);
        $('#frigateTotal').html('$' + parseInt(frigateTotal));
      } else if (planName == 'cruiser') {
        if (cruiserAddOnFee < 0) {
          cruiserAddOnFee = 0;
          return;
        }
        cruiserAddOnFee -= parseInt(planPrice);
        $('#cruiserAddOn').html('$' + parseInt(cruiserAddOnFee));
        cruiserTotal -= parseInt(planPrice);
        $('#cruiserTotal').html('$' + parseInt(cruiserTotal));
      }
    }
  });

  // new code



    
    $(".without-product-plan").click(function() {

      without_product_url = 'order?';

      without_product_url+= 'p='+$(this).attr("data-plan");
      without_product_url+= '&ct='+$("#companyType").val();
      without_product_url+= '&cct='+$("#companyCity").val();

      window.location.href = without_product_url;

    })

     $(".with-product-plan").click(function() {

      with_product_url = 'order?';

      let pLaN = $(this).attr("data-plan");

      //console.log(with_product_url)

      with_product_url+= 'p='+pLaN
      with_product_url+= '&ct='+$("#companyType").val();
      with_product_url+= '&cct='+$("#companyCity").val();
     
      if(url_products[pLaN]) {

        if(url_products[pLaN].length) {

            let ref = '&ref=';
            let items = []

          url_products[pLaN].forEach(function(item) {
            console.warn(item);
            items.push(item.productRef);
          })

          ref+=items.join("-");
          with_product_url+=ref;
        }
      }

      //console.log(with_product_url);

      window.location.href = with_product_url;

    });

     $(document).on("click",".single-plans, .first-plans, .second-plans, .without-label",function() {

      if(!$(this).siblings("input[type='checkbox']").is(":checked")){
        $(this).siblings("input[type='checkbox']").trigger("click");
        $(this).siblings("input[type='checkbox']").prop("checked",true)
      } else {
        $(this).siblings("input[type='checkbox']").trigger("click");
        $(this).siblings("input[type='checkbox']").prop("checked",false)
      }

     })

      $("#exit-01").click(function(){
      $("#content-01").hide();
      });
      $(document).on("click",".show-desc",function(event){
       event.stopPropagation();
      let pdtxt = $(this).prev("h4").text()
      let found = productList.filter((p)=> p.name == pdtxt)

      if(found.length) {
      $("#productTitle").html(found[0].name);
      $("#productDescription").html(found[0].description);
      console.log(found)
      $("#content-01").show();

      }

      });

         // close popup on esc
      $(document).keyup(function(e) {
       if (e.key === "Escape") { // escape key maps to keycode `27`
           $("#content-01").hide();
      }
      });

      // close popup click on body
      $(document).on("click","body",function(e) {
          
          if($("#content-01").is(":visible")){

               $("#content-01").hide();
          }
        
      });

});

