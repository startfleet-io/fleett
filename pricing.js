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
  let frigateProducts = [1002,1009,1010,1025];
  let cruiserproducts = [1002,1009,1010,1025,1015,1016,1024];
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



  $.get(`https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/pricing`,{},async function(data, textStatus, jqXHR) {

    const { plans, state_fess, products } = data;

      productList = products;
    
      // plans

      let x = plans.filter((p)=> p.name.toLowerCase() == 'corvette')[0];
      let y = plans.filter((p)=> p.name.toLowerCase() == 'frigate')[0];
      let z = plans.filter((p)=> p.name.toLowerCase() == 'cruiser')[0];

     // let [x, y, z] = plans;


      var badge = '<div id="wrapper-img-featured-label" class="img-featured-plans">';
      badge+='<img src="images/featured-label-new.svg" loading="lazy" id="img-featured-label" alt="" class="image-21">';
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

      formationItems = await products.reverse()
        .filter((item) => (item.category == 'formation' && item.is_hide==false));

      formationItems.forEach((item, index) => {

       

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included_in_corvette'] == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_corvette'] == false &&
          item['corvette_price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
            item['corvette_price']
          }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['corvette_price'] + ' ' + item['payment_type']
              : item['corvette_price']
          } `;
        }
        if (item['included_in_frigate'] == true && item['frigate_price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_frigate'] == false &&
          item['frigate_price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate_price']
          }"  id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['frigate_price'] + ' ' + item['payment_type']
              : item['frigate_price']
          } `;
        }
        if (item['included_in_cruiser'] == true && item['cruiser_price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_cruiser'] == false &&
          item['cruiser_price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser" data-price="${
            item['cruiser_price']
          }"  id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['cruiser_price'] + ' ' + item['payment_type']
              : item['cruiser_price']
          } `;
        }

        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#GridFormation').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="#" class="help w-inline-block"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center"><div class="tb">${corvette}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${frigate}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${cruiser}</div></div></div>`,
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
      complianceItems = products
        .reverse()
        .filter((item) => (item.category == 'compliance' && item.is_hide==false));
      //console.log('compliance items', complianceItems);
      complianceItems.forEach((item, index) => {

       

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included_in_corvette'] == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_corvette'] == false &&
          item['corvette_price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
            item['corvette_price']
          }"  id="${item._id}" data-ref="${item['refcode']}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['corvette_price'] + ' ' + item['payment_type']
              : item['corvette_price']
          } `;
        }
        if (item['included_in_frigate'] == true && item['frigate_price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_frigate'] == false &&
          item['frigate_price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate_price']
          }"  id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['frigate_price'] + ' ' + item['payment_type']
              : item['frigate_price']
          } `;
        }
        if (item['included_in_cruiser'] == true && item['cruiser_price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_cruiser'] == false &&
          item['cruiser_price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
            item['cruiser_price']
          }"  id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['corvette_price'] + ' ' + item['payment_type']
              : item['cruiser_price']
          } `;
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#gridCompliance').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="#" class="help w-inline-block"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center"><div class="tb">${corvette}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${frigate}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${cruiser}</div></div></div>`,
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
      growthItems = products
        .reverse()
        .filter((item) => (item.category == 'growth' && item.is_hide==false));
      growthItems.forEach((item, index) => {

        

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included_in_corvette'] == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_corvette'] == false &&
          item['corvette_price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
            item['corvette_price']
          }" id="${item._id}" data-ref="${item['refcode']}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['corvette_price'] + ' ' + item['payment_type']
              : item['corvette_price']
          } `;
        }
        if (item['included_in_frigate'] == true && item['frigate_price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_frigate'] == false &&
          item['frigate_price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate_price']
          }"  id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['frigate_price'] + ' ' + item['payment_type']
              : item['frigate_price']
          } `;
        }
        if (item['included_in_cruiser'] == true && item['cruiser_price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_cruiser'] == false &&
          item['cruiser_price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
            item['cruiser_price']
          }" id="${item._id}" /> $${
            item['payment_type'] == 'Yearly' ||
            item['payment_type'] == 'Monthly'
              ? item['cruiser_price'] + ' ' + item['payment_type']
              : item['cruiser_price']
          } `;
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';
        $('#gridGrowth').append(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="#" class="help w-inline-block"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center"><div class="tb">${corvette}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${frigate}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${cruiser}</div></div></div>`,
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
      Addons = products
        .reverse()
        .filter((item) => (item.category == 'addons' && item.is_hide==false));
      Addons.forEach((item, index) => {

        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included_in_corvette'] == true &&
          item['corvette_price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_corvette'] == false &&
          item['corvette_price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup_fee'] == 0) {
            corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
              item['corvette_price']
            }" id="${item._id}" data-ref="${item['refcode']}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['corvette_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? item['setup_fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['corvette_price'] +
                  item['payment_type']
                : item['corvette_price']
            } `;
          } else {
            corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
              item['corvette_price'] + item['setup_fee']
            }" id="${item._id}" data-ref="${item['refcode']}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['corvette_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? '<span class="setup_fee">' +
                  item['setup_fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['corvette_price'] +
                  ' ' +
                  item['payment_type'] +
                  '</span>'
                : item['corvette_price']
            } `;
          }
        }
        if (item['included_in_frigate'] == true && item['frigate_price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_frigate'] == false &&
          item['frigate_price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup_fee'] == 0) {
            frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
              item['frigate_price']
            }" id="${item._id}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['frigate_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? item['setup_fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['frigate_price'] +
                  item['payment_type']
                : item['frigate_price']
            } `;
          } else {
            frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
              item['frigate_price'] + item['setup_fee']
            }" id="${item._id}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['frigate_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? '<span class="setup_fee">' +
                  item['setup_fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['frigate_price'] +
                  ' ' +
                  item['payment_type'] +
                  '</span>'
                : item['frigate_price']
            } `;
          }
        }
        if (item['included_in_cruiser'] == true && item['cruiser_price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included_in_cruiser'] == false &&
          item['cruiser_price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup_fee'] == 0) {
            cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
              item['cruiser_price']
            }" id="${item._id}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['cruiser_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? item['setup_fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['cruiser_price'] +
                  item['payment_type']
                : item['cruiser_price']
            } `;
          } else {
            cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
              item['cruiser_price'] + item['setup_fee']
            }" id="${item._id}" /> $${
              item['payment_type'] == 'Yearly'
                ? item['cruiser_price'] + ' ' + item['payment_type']
                : item['payment_type'] == 'Monthly'
                ? '<span class="setup_fee">' +
                  item['setup_fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['cruiser_price'] +
                  ' ' +
                  item['payment_type'] +
                  '</span>'
                : item['cruiser_price']
            } `;
          }
        }
        let alternate = index % 2 != 0 ? '' : 'row-bg';

        $('#Addons').prepend(
          `<div class="table-row ${alternate}"><div class="pricing-table-cell"><h4 class="pricing-cell-title">${item.name}</h4><a data-tippy-content="Add custom tooltips" href="#" class="help w-inline-block"><img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d874a76a8499e179433725_Icon%20awesome-question-circle.png" alt="" class="help-icon"></a></div><div class="pricing-table-cell cell-center"><div class="tb">${corvette}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${frigate}</div></div><div class="pricing-table-cell cell-center"><div class="tb">${cruiser}</div></div></div>`,
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

      console.log(planPrice);

      if (planName == 'corvette') {

        let productRef = $(this).data('ref');
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
});