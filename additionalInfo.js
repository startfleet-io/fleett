var version, source;
var API_BASE = `https://xe5a-injf-5wxp.n7.xano.io`;
var API_GET_ORDER_INFO;
var API_POST_MORE_INFO;

function setUpTestEnv() {
    version = getParameterByName('v');
    source = getParameterByName('source');

    if (version && source) {
        API_VERSION = `:v${version}`;
        API_GET_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/orderInfo`;
        API_POST_MORE_INFO = `${API_BASE}/api:z9NOXVAQ${API_VERSION}/tripetto_form`;

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Data-Source', 'test');
            },
        });

        console.warn('test mode');
    } else {
        API_GET_ORDER_INFO = `${API_BASE}/api:z9NOXVAQ/orderInfo`;
        API_POST_MORE_INFO = `${API_BASE}/api:z9NOXVAQ/tripetto_form`;
        console.warn('live mode');
    }
}

var renderMoreInfoForm = (function () {
    var INDUSTRY_GROUPS = [
        [
            'E-commerce and retail',
            [
                'E-commerce',
                'E-commerce/Shopify',
                'E-commerce/Amazon',
                'E-commerce/eBay',
                'E-commerce/Etsy',
                'E-commerce/TikTok Shop',
                'E-commerce/Walmart Marketplace',
                'Dropshipping',
                'Print on Demand',
                'Subscription Boxes',
                'Marketplace',
                'Retail Store',
                'Wholesale and Distribution',
                'Import/Export and Trading',
            ],
        ],
        [
            'Software and technology',
            [
                'B2B Software',
                'Enterprise Software',
                'Consumer Tech',
                'Mobile Apps',
                'Developer Tools',
                'Artificial Intelligence',
                'Web and App Development',
                'IT Services',
                'Cybersecurity',
                'Data and Analytics',
                'Cloud and Hosting',
                'Hardware and Electronics',
                'Video Games',
                'Community Tech',
                'Government Tech',
                'Healthcare Tech',
                'Education Tech',
                'Fintech',
                'Crypto',
                'Blockchain and Web3',
            ],
        ],
        [
            'Marketing, media and creative',
            [
                'Marketing',
                'Advertising',
                'Digital Marketing Agency',
                'Social Media Management',
                'SEO and Content Writing',
                'Content Creator / Influencer',
                'Media',
                'Publishing',
                'Podcasting',
                'Video Production',
                'Photography',
                'Graphic Design',
                'Public Relations',
            ],
        ],
        [
            'Professional services',
            [
                'Consulting',
                'Management Consulting',
                'Accounting and Bookkeeping',
                'Tax Services',
                'Legal Services',
                'Recruiting',
                'Staffing and HR Services',
                'Business Coaching',
                'Virtual Assistant Services',
                'Outsourcing / BPO',
                'Customer Support Services',
                'Translation and Localization',
            ],
        ],
        [
            'Finance and investment',
            [
                'Financial Services',
                'Investment',
                'Holding Company',
                'Venture Capital / Private Equity',
                'Trading (stocks, forex, crypto)',
                'Payments',
                'Insurance',
            ],
        ],
        [
            'Real estate and construction',
            [
                'Real Estate',
                'Real Estate Investment',
                'Property Management',
                'Short-term Rentals',
                'Construction',
                'Architecture and Interior Design',
                'Home Services',
            ],
        ],
        ['Education', ['Education', 'Online Courses', 'Tutoring', 'Corporate Training']],
        [
            'Health, beauty and wellness',
            [
                'Healthcare',
                'Telehealth',
                'Fitness',
                'Wellness and Nutrition',
                'Supplements',
                'Beauty and Cosmetics',
                'Mental Health',
                'Medical Devices',
            ],
        ],
        [
            'Travel, food and hospitality',
            ['Travel', 'Travel Agency', 'Tours and Tourism', 'Hospitality', 'Restaurants and Food Service', 'Food and Beverage', 'Events'],
        ],
        [
            'Entertainment, fashion and sports',
            [
                'Entertainment',
                'Art',
                'Music',
                'Film and TV',
                'Fashion and Apparel',
                'Jewelry and Accessories',
                'Sports Team',
                'Sports and Recreation',
            ],
        ],
        ['Transportation and logistics', ['Transportation', 'Logistics and Freight', 'Shipping and Fulfillment', 'Automotive']],
        ['Industry and energy', ['Manufacturing', 'Agriculture', 'Energy', 'Renewable Energy', 'Environmental Services', 'Telecommunications']],
        ['Other', ['Research', 'Non-profit and Social Impact', 'Pets', 'Personal Services', 'Other']],
    ];
    var OTHER_INDUSTRY = 'Other';
    var MIN_DESCRIPTION = 160;
    var MAX_MEMBERS = 10;
    var ALREADY_SUBMITTED = 'This entity already exists';

    var TRANSITIONS = {
        editing: { submit: 'submitting' },
        submitting: { succeeded: 'done', duplicate: 'already_submitted', failed: 'failed' },
        failed: { submit: 'submitting' },
        done: {},
        already_submitted: {},
    };

    var PANELS = {
        done: "Thank you, we've received your details. Our team will review them and be in touch by email.",
        already_submitted: 'We already have your details for this order. If you need to change anything, please contact us.',
    };

    // Accept a comma decimal mark (33,33), common outside the US.
    function decimalText(value) {
        return String(value).trim().replace(',', '.');
    }

    function percentCents(value) {
        var text = decimalText(value);
        if (!/^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(text)) return null;
        var cents = Math.round(parseFloat(text) * 100);
        return cents > 0 ? cents : null;
    }

    function formatCents(cents) {
        return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
    }

    function totalCents(members) {
        return members.reduce((sum, member) => sum + (percentCents(member.ownership) || 0), 0);
    }

    function equalShares(count) {
        var base = Math.floor(10000 / count);
        var remainder = 10000 - base * count;
        return Array.from({ length: count }, (_, i) => formatCents(base + (i < remainder ? 1 : 0)));
    }

    function wholeNumberText(value) {
        return String(value).trim().replace(/[,\s]/g, '');
    }

    function isPositiveWholeNumber(value) {
        var text = wholeNumberText(value);
        return /^\d+$/.test(text) && parseInt(text, 10) > 0;
    }

    function isPositiveNumber(value) {
        var text = decimalText(value);
        return /^(\d+(\.\d+)?|\.\d+)$/.test(text) && parseFloat(text) > 0;
    }

    function filled(field, message) {
        return { field, message, valid: a => String(a[field]).trim() !== '' };
    }

    function checked(field, message) {
        return { field, message, valid: a => a[field] === true };
    }

    var COMMON_RULES = [
        checked('confirm_name', 'Please confirm your company name.'),
        checked('confirm_state', 'Please confirm the state.'),
        checked('confirm_structure', 'Please confirm the structure.'),
        checked('confirm_suffix', 'Please confirm the suffix.'),
        filled('industry', 'Please choose an industry.'),
        {
            field: 'industry_other',
            message: 'Please type your industry.',
            valid: a => a.industry !== OTHER_INDUSTRY || a.industry_other.trim() !== '',
        },
        {
            field: 'description',
            message: `Please write at least ${MIN_DESCRIPTION} characters.`,
            valid: a => a.description.trim().length >= MIN_DESCRIPTION,
        },
    ];

    var CORPORATION_RULES = [
        filled('president', 'Please enter the name of the president.'),
        filled('ceo', 'Please enter the name of the CEO.'),
        filled('cfo', 'Please enter the name of the CFO.'),
        filled('secretary', 'Please enter the name of the secretary.'),
        { field: 'authorized_shares', message: 'Please enter a whole number above 0.', valid: a => isPositiveWholeNumber(a.authorized_shares) },
        { field: 'par_value', message: 'Please enter a number above 0.', valid: a => isPositiveNumber(a.par_value) },
    ];

    function memberRules(members) {
        var rows = members.flatMap((_, i) => [
            {
                field: `members.${i}.legal_name`,
                message: "Please enter this member's legal name.",
                valid: a => a.members[i].legal_name.trim() !== '',
            },
            {
                field: `members.${i}.ownership`,
                message: 'Please enter a percentage above 0, with at most 2 decimals.',
                valid: a => percentCents(a.members[i].ownership) !== null,
            },
        ]);
        rows.push({
            field: 'members_total',
            focus: 'members.0.ownership',
            message: 'Ownership must add up to 100%.',
            valid: a => {
                var total = totalCents(a.members);
                return total >= 9999 && total <= 10001;
            },
        });
        return rows;
    }

    function validate(answers, isCorporation) {
        var rules = COMMON_RULES.concat(isCorporation ? CORPORATION_RULES : memberRules(answers.members));
        return rules.filter(rule => !rule.valid(answers));
    }

    function buildFormData(answers, order, isCorporation, isTest) {
        var formData = {
            test: isTest,
            company_name: answers.company_name.trim(),
            orderId: order.orderId,
            state: order.state,
            structure: order.structure,
            suffix: order.suffix,
            company_industry: answers.industry === OTHER_INDUSTRY ? `Other: ${answers.industry_other.trim()}` : answers.industry,
            company_description: answers.description.trim(),
        };
        if (isCorporation) {
            formData.name_of_president = answers.president.trim();
            formData.name_of_ceo = answers.ceo.trim();
            formData.name_of_cfo = answers.cfo.trim();
            formData.name_of_secretary = answers.secretary.trim();
            formData.num_of_authorized_shares = wholeNumberText(answers.authorized_shares);
            formData.par_value_of_share = decimalText(answers.par_value);
        } else {
            formData.num_of_members = answers.members.length;
            formData.members = answers.members.map(member => ({
                legal_member_name: member.legal_name.trim(),
                ownership_percentage: formatCents(percentCents(member.ownership)),
            }));
        }
        return formData;
    }

    function inputId(field) {
        return `sf-mi-${field.replace(/\./g, '-')}`;
    }

    function fieldHtml(field, label, control, help) {
        return `<div class="sf-mi-field">
            <label class="sf-mi-label" for="${inputId(field)}">${label}</label>
            ${help ? `<p class="sf-mi-help">${help}</p>` : ''}
            ${control}
            <p class="sf-mi-error" data-error-for="${field}" hidden></p>
        </div>`;
    }

    function textInput(field, attrs) {
        return `<input class="sf-mi-input" type="text" id="${inputId(field)}" name="${field}" ${attrs || ''}>`;
    }

    function confirmedField(field, label, confirmField, confirmLabel, help) {
        return `<div class="sf-mi-field">
            <span class="sf-mi-label">${label}</span>
            ${help ? `<p class="sf-mi-help">${help}</p>` : ''}
            <div class="sf-mi-readonly" data-readonly="${field}"></div>
            <label class="sf-mi-check"><input type="checkbox" name="${confirmField}"> ${confirmLabel}</label>
            <p class="sf-mi-error" data-error-for="${confirmField}" hidden></p>
        </div>`;
    }

    function industrySelect() {
        var groups = INDUSTRY_GROUPS.map(
            ([heading, options]) => `<optgroup label="${heading}">${options.map(o => `<option value="${o}">${o}</option>`).join('')}</optgroup>`,
        ).join('');
        var placeholder = '<option value="">Choose an industry</option>';
        return `<select class="sf-mi-input" id="${inputId('industry')}" name="industry">${placeholder}${groups}</select>`;
    }

    function memberCountSelect() {
        var options = Array.from({ length: MAX_MEMBERS }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
        return `<select class="sf-mi-input" id="${inputId('num_of_members')}" name="num_of_members">${options}</select>`;
    }

    function llcHtml() {
        return `${fieldHtml('num_of_members', 'Number of members', memberCountSelect(), 'Members are the owners of the LLC.')}
            <div class="sf-mi-field">
                <span class="sf-mi-label">Members and ownership</span>
                <p class="sf-mi-help">Enter each member's full legal name and their share of the company. The shares must add up to 100%.</p>
                <div class="sf-mi-members"></div>
                <div class="sf-mi-total">
                    <span>Total: <strong class="sf-mi-total-value"></strong></span>
                    <button type="button" class="sf-mi-secondary sf-mi-split">Split equally</button>
                </div>
                <p class="sf-mi-error" data-error-for="members_total" hidden></p>
            </div>`;
    }

    function corporationHtml() {
        return `${fieldHtml('president', 'Name of president', textInput('president', 'autocomplete="off"'))}
            ${fieldHtml('ceo', 'Name of CEO', textInput('ceo', 'autocomplete="off"'))}
            ${fieldHtml('cfo', 'Name of CFO', textInput('cfo', 'autocomplete="off"'))}
            ${fieldHtml(
                'secretary',
                'Name of secretary',
                textInput('secretary', 'autocomplete="off"'),
                'One person can hold more than one of these roles.',
            )}
            ${fieldHtml(
                'authorized_shares',
                'Number of authorized shares',
                textInput('authorized_shares', 'inputmode="numeric" placeholder="e.g. 5000"'),
                'The most shares the corporation may issue.',
            )}
            ${fieldHtml('par_value', 'Par value per share (USD)', textInput('par_value', 'inputmode="decimal" placeholder="e.g. 0.0001"'))}`;
    }

    function formHtml(isCorporation) {
        var fromOrder = 'From your order. If this is wrong, please contact us.';
        return `<form class="sf-mi-form" novalidate>
            ${confirmedField('company_name', 'Company name', 'confirm_name', 'This is my company name', fromOrder)}
            ${confirmedField('state', 'State', 'confirm_state', "This is my company's state", fromOrder)}
            ${confirmedField('structure', 'Structure', 'confirm_structure', "This is my company's structure", fromOrder)}
            ${confirmedField('suffix', 'Suffix', 'confirm_suffix', "This is my company's suffix", fromOrder)}
            ${fieldHtml('industry', 'Industry', industrySelect())}
            <div class="sf-mi-industry-other" hidden>
                ${fieldHtml('industry_other', 'Your industry', textInput('industry_other'))}
            </div>
            ${fieldHtml(
                'description',
                'Company description',
                `<textarea class="sf-mi-input" id="${inputId('description')}" name="description" rows="6"></textarea>
                <p class="sf-mi-counter" aria-live="polite"></p>`,
                `Tell us what your company does, who your customers are and how you make money (at least ${MIN_DESCRIPTION} characters). Why we ask: it helps us get to know your business, and US banks ask for this when you open a business account, so a clear description helps your bank application go smoothly.`,
            )}
            ${isCorporation ? corporationHtml() : llcHtml()}
            <button type="submit" class="sf-mi-button">Submit</button>
        </form>`;
    }

    function memberRowHtml(i) {
        var name = `members.${i}.legal_name`;
        var ownership = `members.${i}.ownership`;
        return `<div class="sf-mi-member">
            <div class="sf-mi-member-name">
                <label class="sf-mi-label" for="${inputId(name)}">Member ${i + 1} legal name</label>
                ${textInput(name, 'autocomplete="off"')}
                <p class="sf-mi-error" data-error-for="${name}" hidden></p>
            </div>
            <div class="sf-mi-member-pct">
                <label class="sf-mi-label" for="${inputId(ownership)}">Ownership %</label>
                ${textInput(ownership, 'inputmode="decimal" placeholder="e.g. 50"')}
                <p class="sf-mi-error" data-error-for="${ownership}" hidden></p>
            </div>
        </div>`;
    }

    var STYLE = `
        .sf-mi-form, .sf-mi-panel { font: inherit; color: inherit; text-align: left; max-width: 640px; margin: 0 auto; }
        .sf-mi-form *, .sf-mi-form *::before, .sf-mi-form *::after { box-sizing: border-box; }
        .sf-mi-form [hidden] { display: none !important; }
        .sf-mi-field { margin: 0 0 22px; }
        .sf-mi-label { display: block; font-weight: 600; margin: 0 0 6px; }
        .sf-mi-help { margin: 0 0 8px; font-size: 0.9em; line-height: 1.45; opacity: 0.8; }
        .sf-mi-input { display: block; width: 100%; min-height: 44px; margin: 0; padding: 10px 12px; font: inherit; color: #111827;
            background: #fff; border: 1px solid #c4c8cf; border-radius: 6px; }
        textarea.sf-mi-input { min-height: 150px; resize: vertical; }
        .sf-mi-input:focus { outline: 2px solid #2563eb; outline-offset: 1px; }
        .sf-mi-input[aria-invalid='true'] { border-color: #b42318; }
        .sf-mi-readonly { padding: 10px 12px; background: #f3f4f6; border-radius: 6px; overflow-wrap: anywhere; }
        .sf-mi-check { display: flex; gap: 10px; align-items: flex-start; margin: 10px 0 0; font-weight: 400; cursor: pointer; }
        .sf-mi-check input { flex: none; width: 18px; height: 18px; margin: 2px 0 0; }
        .sf-mi-error { margin: 6px 0 0; color: #b42318; font-size: 0.9em; }
        .sf-mi-counter { margin: 4px 0 0; font-size: 0.85em; text-align: right; opacity: 0.8; }
        .sf-mi-counter.sf-mi-met { color: #067647; opacity: 1; }
        .sf-mi-member { display: flex; flex-wrap: wrap; gap: 10px 12px; margin: 0 0 10px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .sf-mi-member-name { flex: 1 1 200px; min-width: 0; }
        .sf-mi-member-pct { flex: 1 1 110px; max-width: 160px; min-width: 0; }
        .sf-mi-member .sf-mi-label { font-weight: 500; font-size: 0.9em; }
        .sf-mi-total { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }
        .sf-mi-button, .sf-mi-secondary { min-height: 44px; padding: 10px 20px; font: inherit; font-weight: 600; border-radius: 6px; cursor: pointer; }
        .sf-mi-button { width: 100%; color: #fff; background: #1d4ed8; border: 0; }
        .sf-mi-button:disabled { opacity: 0.6; cursor: wait; }
        .sf-mi-secondary { color: #1d4ed8; background: #fff; border: 1px solid #1d4ed8; }
        .sf-mi-panel { padding: 24px; border: 1px solid #abefc6; border-radius: 8px; background: #ecfdf3; color: #054f31; font-size: 1.15em; line-height: 1.5; }
        @media (min-width: 640px) { .sf-mi-button { width: auto; } }
    `;

    function injectStyle() {
        if (document.getElementById('sf-mi-style')) return;
        var style = document.createElement('style');
        style.id = 'sf-mi-style';
        style.textContent = STYLE;
        document.head.appendChild(style);
    }

    function setAnswer(answers, path, value) {
        var keys = path.split('.');
        var last = keys.pop();
        keys.reduce((target, key) => target[key], answers)[last] = value;
    }

    return function render(container, order, isTest) {
        if (!container) return;
        var isCorporation = order.structure.toLowerCase() === 'corporation';
        var answers = {
            company_name: order.companyName,
            confirm_name: false,
            confirm_state: false,
            confirm_structure: false,
            confirm_suffix: false,
            industry: '',
            industry_other: '',
            description: '',
            members: [{ legal_name: '', ownership: '' }],
            president: '',
            ceo: '',
            cfo: '',
            secretary: '',
            authorized_shares: '',
            par_value: '',
        };
        var status = 'editing';
        var showErrors = false;

        injectStyle();
        var $container = $(container).html(formHtml(isCorporation));
        var $form = $container.find('.sf-mi-form');
        var $button = $form.find('.sf-mi-button');

        $form.find('[data-readonly="company_name"]').text(answers.company_name || '-');
        ['state', 'structure', 'suffix'].forEach(field => $form.find(`[data-readonly="${field}"]`).text(order[field] || '-'));

        function renderErrors() {
            var errors = showErrors ? validate(answers, isCorporation) : [];
            var byField = {};
            errors.forEach(error => (byField[error.field] = error.message));
            $form.find('[data-error-for]').each(function () {
                var message = byField[this.getAttribute('data-error-for')];
                $(this)
                    .text(message || '')
                    .prop('hidden', !message);
            });
            $form.find('[name]').each(function () {
                $(this).attr('aria-invalid', this.name in byField ? 'true' : null);
            });
            return errors;
        }

        function renderCounter() {
            var count = answers.description.trim().length;
            $form
                .find('.sf-mi-counter')
                .text(`${count} / ${MIN_DESCRIPTION}`)
                .toggleClass('sf-mi-met', count >= MIN_DESCRIPTION);
        }

        function renderTotal() {
            $form.find('.sf-mi-total-value').text(`${formatCents(totalCents(answers.members))}%`);
        }

        function renderMembers() {
            var $members = $form.find('.sf-mi-members');
            $members.html(answers.members.map((_, i) => memberRowHtml(i)).join(''));
            answers.members.forEach((member, i) => {
                $members.find(`[name="members.${i}.legal_name"]`).val(member.legal_name);
                $members.find(`[name="members.${i}.ownership"]`).val(member.ownership);
            });
            renderTotal();
        }

        function setMemberCount(count) {
            answers.members = Array.from({ length: count }, (_, i) => answers.members[i] || { legal_name: '', ownership: '' });
            renderMembers();
        }

        function renderStatus() {
            if (PANELS[status]) {
                $container.empty().append($('<div class="sf-mi-panel" role="status"></div>').text(PANELS[status]));
                container.scrollIntoView({ block: 'center' });
                return;
            }
            $button.prop('disabled', status === 'submitting').text(status === 'submitting' ? 'Sending...' : 'Submit');
        }

        function dispatch(event) {
            status = TRANSITIONS[status][event];
            renderStatus();
        }

        function onAnswer() {
            var value = this.type === 'checkbox' ? this.checked : this.value;
            if (this.name === 'num_of_members') {
                setMemberCount(parseInt(value, 10));
            } else {
                setAnswer(answers, this.name, value);
            }
            if (this.name === 'industry') $form.find('.sf-mi-industry-other').prop('hidden', value !== OTHER_INDUSTRY);
            if (this.name === 'description') renderCounter();
            if (this.name.endsWith('.ownership')) renderTotal();
            renderErrors();
        }

        $form.on('input', 'input[type="text"], textarea', onAnswer);
        $form.on('change', 'select, input[type="checkbox"]', onAnswer);

        $form.on('click', '.sf-mi-split', function () {
            equalShares(answers.members.length).forEach((share, i) => {
                answers.members[i].ownership = share;
                $form.find(`[name="members.${i}.ownership"]`).val(share);
            });
            renderTotal();
            renderErrors();
        });

        $form.on('submit', function (event) {
            event.preventDefault();
            if (!TRANSITIONS[status].submit) return;
            showErrors = true;
            var errors = renderErrors();
            if (errors.length) {
                $form.find(`[name="${errors[0].focus || errors[0].field}"]`).trigger('focus');
                return;
            }
            dispatch('submit');
            var form_data = buildFormData(answers, order, isCorporation, isTest);
            $.ajax({
                url: API_POST_MORE_INFO,
                type: 'POST',
                data: { form_data },
                dataType: 'JSON',
            })
                .done(() => dispatch('succeeded'))
                .fail(error => {
                    var message = (error.responseJSON && error.responseJSON.message) || 'Something went wrong';
                    if (message === ALREADY_SUBMITTED) {
                        dispatch('duplicate');
                        return;
                    }
                    dispatch('failed');
                    Swal.fire({ icon: 'error', title: 'Oops...', text: `${message} - please contact us.` });
                });
        });

        renderCounter();
        if (!isCorporation) renderMembers();
        renderStatus();
    };
})();

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

    let coldStop = getParameterByName('coldStop');
    let orderID = getParameterByName('orderId');
    let pstate = getParameterByName('state');
    let pstructure = getParameterByName('structure');

    let savedState = localStorage.getItem('state') ?? '';
    let savedStructure = localStorage.getItem('structure') ?? '';
    let savedOrderId = localStorage.getItem('orderId') ?? 0;

    if (coldStop == '' || !coldStop || coldStop != 'yes' || savedOrderId != orderID || savedState != pstate || savedStructure != pstructure) {
        let url = new URL(window.location.href);
        let search_params = url.searchParams;

        $.ajax({
            url: API_GET_ORDER_INFO,
            type: 'POST',
            data: { orderID },
            dataType: 'JSON',
            success: function (response) {
                const { company_name, company_state, company_structure, company_suffix, purchase_order_id } = response;

                let structure;
                if (company_structure.toLowerCase() == 'corporation') {
                    structure = 'Corporation';
                } else {
                    structure = 'LLC';
                }
                localStorage.setItem('orderId', purchase_order_id);
                localStorage.setItem('state', capitalizeFirstLetter(company_state));
                localStorage.setItem('structure', structure);
                search_params.set('companyName', capitalizeFirstLetter(company_name));
                search_params.set('state', capitalizeFirstLetter(company_state));
                search_params.set('structure', structure);
                search_params.set('suffix', company_suffix);
                search_params.set('coldStop', 'yes');
                window.history.pushState({ path: url.href }, '', url.href);
                window.location = window.location;
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Sorry order not found',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                });
            },
        });
    } else {
        var structure = getParameterByName('structure');
        if (structure.toLowerCase() == 'corporation') {
            structure = 'Corporation';
        } else {
            structure = 'LLC';
        }
        let txt = $('#dynamic-heading').text();
        txt = `${txt} ${structure}`;
        $('#dynamic-heading').text(txt);

        renderMoreInfoForm(
            document.getElementById('tripetto'),
            {
                orderId: orderID,
                companyName: getParameterByName('companyName') || '',
                state: pstate,
                structure: pstructure,
                suffix: getParameterByName('suffix') || '',
            },
            Boolean(version && source),
        );
    }
}
init();
