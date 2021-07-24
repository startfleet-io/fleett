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

  $.get(
    'https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/state-fees',
    {},
    function (data, textStatus, jqXHR) {
      dt = data;
    },
  );
  $.get(
    'https://x8ki-letl-twmt.n7.xano.io/api:z9NOXVAQ/plan',
    {},
    function (data, textStatus, jqXHR) {
      plans = data;
      let [x, y, z] = plans;
      frigateTotal += x.price + 100;
      covertteTotal += y.price + 100;
      cruiserTotal += z.price + 100;
      $('#frigateTotal').html('$' + frigateTotal);
      $('#covertteTotal').html('$' + covertteTotal);
      $('#cruiserTotal').html('$' + cruiserTotal);
    },
  );
  $.get(
    'https://x8ki-letl-twmt.n7.xano.io/api:z9NOXVAQ/get-webflow-product',
    {},
    function (data, textStatus, jqXHR) {
      console.log(data.response.result.items);
      formationItems = data.response.result.items
        .reverse()
        .filter((item) => item.category == 'Formation');
      formationItems.forEach((item, index) => {
        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included-in-corvette'] == true &&
          item['corvette-price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-corvette'] == false &&
          item['corvette-price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
            item['corvette-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['corvette-price'] + ' ' + item['payment-type']
              : item['corvette-price']
          } `;
        }
        if (item['included-in-frigate'] == true && item['frigate-price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-frigate'] == false &&
          item['frigate-price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['frigate-price'] + ' ' + item['payment-type']
              : item['frigate-price']
          } `;
        }
        if (item['included-in-cruiser'] == true && item['cruiser-price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-cruiser'] == false &&
          item['cruiser-price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser" data-price="${
            item['cruiser-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['cruiser-price'] + ' ' + item['payment-type']
              : item['cruiser-price']
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
      complianceItems = data.response.result.items
        .reverse()
        .filter((item) => item.category == 'Compliance');
      console.log('compliance items', complianceItems);
      complianceItems.forEach((item, index) => {
        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included-in-corvette'] == true &&
          item['corvette-price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-corvette'] == false &&
          item['corvette-price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
            item['corvette-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['corvette-price'] + ' ' + item['payment-type']
              : item['corvette-price']
          } `;
        }
        if (item['included-in-frigate'] == true && item['frigate-price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-frigate'] == false &&
          item['frigate-price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['frigate-price'] + ' ' + item['payment-type']
              : item['frigate-price']
          } `;
        }
        if (item['included-in-cruiser'] == true && item['cruiser-price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-cruiser'] == false &&
          item['cruiser-price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
            item['cruiser-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['corvette-price'] + ' ' + item['payment-type']
              : item['cruiser-price']
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
      growthItems = data.response.result.items
        .reverse()
        .filter((item) => item.category == 'Growth');
      growthItems.forEach((item, index) => {
        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included-in-corvette'] == true &&
          item['corvette-price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-corvette'] == false &&
          item['corvette-price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette" data-price="${
            item['corvette-price']
          }" id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['corvette-price'] + ' ' + item['payment-type']
              : item['corvette-price']
          } `;
        }
        if (item['included-in-frigate'] == true && item['frigate-price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-frigate'] == false &&
          item['frigate-price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate" data-price="${
            item['frigate-price']
          }"  id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['frigate-price'] + ' ' + item['payment-type']
              : item['frigate-price']
          } `;
        }
        if (item['included-in-cruiser'] == true && item['cruiser-price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-cruiser'] == false &&
          item['cruiser-price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
            item['cruiser-price']
          }" id="${item._id}" /> $${
            item['payment-type'] == 'Yearly' ||
            item['payment-type'] == 'Monthly'
              ? item['cruiser-price'] + ' ' + item['payment-type']
              : item['cruiser-price']
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
      Addons = data.response.result.items
        .reverse()
        .filter((item) => item.category == 'Addons');
      Addons.forEach((item, index) => {
        let corvette = null;
        let frigate = null;
        let cruiser = null;
        if (
          item['included-in-corvette'] == true &&
          item['corvette-price'] == 0
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-corvette'] == false &&
          item['corvette-price'] == -1
        ) {
          corvette =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup-fee'] == 0) {
            corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
              item['corvette-price']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['corvette-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? item['setup-fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['corvette-price'] +
                  item['payment-type']
                : item['corvette-price']
            } `;
          } else {
            corvette = `<input class="mr-5 priceBox" type="checkbox" data-plan="corvette"  data-price="${
              item['corvette-price'] + item['setup-fee']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['corvette-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? '<span class="setup-fee">' +
                  item['setup-fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['corvette-price'] +
                  ' ' +
                  item['payment-type'] +
                  '</span>'
                : item['corvette-price']
            } `;
          }
        }
        if (item['included-in-frigate'] == true && item['frigate-price'] == 0) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-frigate'] == false &&
          item['frigate-price'] == -1
        ) {
          frigate =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup-fee'] == 0) {
            frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
              item['frigate-price']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['frigate-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? item['setup-fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['frigate-price'] +
                  item['payment-type']
                : item['frigate-price']
            } `;
          } else {
            frigate = `<input class="mr-5 priceBox" type="checkbox" data-plan="frigate"  data-price="${
              item['frigate-price'] + item['setup-fee']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['frigate-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? '<span class="setup-fee">' +
                  item['setup-fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['frigate-price'] +
                  ' ' +
                  item['payment-type'] +
                  '</span>'
                : item['frigate-price']
            } `;
          }
        }
        if (item['included-in-cruiser'] == true && item['cruiser-price'] == 0) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60d6e22ef380bfebd4610eeb_Icon%20awesome-check.png" alt="" class="check">';
        } else if (
          item['included-in-cruiser'] == false &&
          item['cruiser-price'] == -1
        ) {
          cruiser =
            '<img src="https://uploads-ssl.webflow.com/60bbb50e4214ca995721f7d9/60dc79882513616b11cfe448_line.png" alt="" class="check">';
        } else {
          if (item['setup-fee'] == 0) {
            cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
              item['cruiser-price']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['cruiser-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? item['setup-fee'] +
                  ' <span>setup</span> ' +
                  '$' +
                  item['cruiser-price'] +
                  item['payment-type']
                : item['cruiser-price']
            } `;
          } else {
            cruiser = `<input class="mr-5 priceBox" type="checkbox" data-plan="cruiser"  data-price="${
              item['cruiser-price'] + item['setup-fee']
            }" id="${item._id}" /> $${
              item['payment-type'] == 'Yearly'
                ? item['cruiser-price'] + ' ' + item['payment-type']
                : item['payment-type'] == 'Monthly'
                ? '<span class="setup-fee">' +
                  item['setup-fee'] +
                  ' setup</span> ' +
                  '<span class="monthly-fee">+ $' +
                  item['cruiser-price'] +
                  ' ' +
                  item['payment-type'] +
                  '</span>'
                : item['cruiser-price']
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
    },
  );
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
    console.log(found);
    let em = 'Plus $' + found.fee + ' ' + found.state + ' fee';
    console.log(em);
    FeeText.html(em);
    stateFee.html('$' + found.fee);
    covertteTotal += found.fee;
    $('#covertteTotal').html('$' + covertteTotal);
    frigateTotal += found.fee;
    $('#frigateTotal').html('$' + frigateTotal);
    cruiserTotal += found.fee;
    $('#cruiserTotal').html('$' + cruiserTotal);
  });

  $('.grid-pricing').on('click', '.priceBox', function () {
    if (this.checked) {
      let planName = $(this).data('plan');
      let planPrice = $(this).data('price');
      if (planName == 'corvette') {
        corvetteAddOnFee += parseInt(planPrice);
        $('#corvetteAddOn').html('$' + corvetteAddOnFee);
        covertteTotal += parseInt(planPrice);
        $('#covertteTotal').html('$' + covertteTotal);
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
        $('#corvetteAddOn').html('$' + corvetteAddOnFee);
        covertteTotal -= parseInt(planPrice);
        $('#covertteTotal').html('$' + covertteTotal);
      } else if (planName == 'frigate') {
        if (frigateAddOnFee < 0) {
          frigateAddOnFee = 0;
          return;
        }
        frigateAddOnFee -= parseInt(planPrice);
        $('#frigateAddOn').html('$' + frigateAddOnFee);
        frigateTotal -= parseInt(planPrice);
        $('#frigateTotal').html('$' + frigateTotal);
      } else if (planName == 'cruiser') {
        if (cruiserAddOnFee < 0) {
          cruiserAddOnFee = 0;
          return;
        }
        cruiserAddOnFee -= parseInt(planPrice);
        $('#cruiserAddOn').html('$' + cruiserAddOnFee);
        cruiserTotal -= parseInt(planPrice);
        $('#cruiserTotal').html('$' + cruiserTotal);
      }
    }
  });
});
