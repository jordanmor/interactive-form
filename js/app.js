/*=============-=============-=============-=============
                    UNOBTRUSIVE JAVASCRIPT
===============-=============-=============-===========*/
$('.activities').append('<p id="total"></p>');
$('.select-method').prop('disabled', true); // Select Payment Method option disabled
$('.cc-option').prop('selected', true); // Credit card payment option selected by default

// Form validation messages
$('form').prepend('<p class="error-message">Please enter all required fields</p>');
$('#name').after('<p class="error-message">Please enter a name</p>');
$('#mail').after('<p class="error-message">Please enter an email</p>');
$('#other-title').after('<p class="error-message other-job">Please enter a job role</p>');
$('.cc-info').after(`<div class="col-12 col">
                        <p class="error-message">Please enter a valid credit card number</p>
                        <p class="error-message">Please enter a valid zip code</p>
                        <p class="error-message">Please enter a valid cvv code</p>
                     </div>`);
$('.activities legend').append('<span class="error-message">- Please choose at least one activity -</span>');
$('.exp-year-label').hide();
$('.error-message').hide();

/*=============-=============-=============-=============
                      CACHED VARIABLES
===============-=============-=============-===========*/

const $name = $('#name').focus(); // Set focus on the first text field

// Job Role Section
const $jobRoleMenu = $('#title');
const $otherTitle = $('#other-title').addClass('is-hidden');

// T-Shirt Info Section
const $designMenu = $('#design');
const $colorOptions = $('#color option');
const $tShirtColorsDiv = $('#colors-js-puns').hide(); //Color menu hidden until T-Shirt design selected

// Register for Activities Section
const $activitiesInputs = $('.activities input');
const $express = $('.activities input[name="express"]');
const $jsFramework = $('.activities input[name="js-frameworks"]');
const $jsLibs = $('.activities input[name="js-libs"]');
const $node = $('.activities input[name="node"]');
const $total = $('#total').hide();
let total = 0; // keeps track of total cost of registered activities

// Payment Info section
const $paymentMenu = $('#payment');
const $ccSection = $('#credit-card');
const $paypal = $('.paypal').hide();
const $bitcoin = $('.bitcoin').hide();

// Form validation
const $inputs = $('input[type=text], input[type=email]');
const $form = $('form');
/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

// Job Role Section
function toggleJobRole() {
  if(this.value === 'other') {
    $otherTitle.removeClass('is-hidden');
  } else {
    $otherTitle.addClass('is-hidden');
  }
}

// T-Shirt Info Section
function displayColorOptions() {
  if(this.value === 'js puns') {
    $tShirtColorsDiv.show();
    $colorOptions
      .prop('selected', false) // no options selected so first 'JS Puns' option will appear
      .hide()
      .filter((i, option) => option.textContent.includes('JS Puns'))
      .show();
  } else if(this.value === 'heart js') {
      $tShirtColorsDiv.show();
      $colorOptions
        .hide()
        .filter((i, option) => option.textContent.includes('I ♥ JS'))
        .show()
        .first()
        .prop('selected', true); // the first filtered 'I ♥ JS' option selected 
  } else {
      $tShirtColorsDiv.hide(); //Color menu hidden if no theme selected
  }
}

// Register for Activities Section
function avoidSchedulingConflicts(workshop, conflictingWorkshop) {
  if(workshop.prop('checked')) {
      conflictingWorkshop
        .prop('disabled', true)
        .parent()
        .append('<span class="unavailable">&nbsp;&nbsp;Unavailable</span>')
        .css('color', '#cbcbcb');
  } else {
      conflictingWorkshop
        .prop('disabled', false)
        .parent()
        .css('color', '#000')
        .children('.unavailable')
        .remove();
  }
}

function computeActivitesCost(input) {
  const regex = /\$(\d+)$/; // Regex looks at the end of the line for any numbers preceded by a dollar sign
  const amount = parseInt($(input).parent().text().match(regex)[1]); // grabs parsed cost of activity from activities label
  $total.show();

  if(input.checked) {
    total += amount;
    $total.text(`Total: $${total}`);
    if (total === 0) $total.hide();
  } else {
      total -= amount;
      $total.text(`Total: $${total}`);
      if (total === 0) $total.hide();
  }
}

// Payment Info section
function displayPaymentSection() {
  if(this.value === 'paypal') {
    $ccSection.hide();
    $paypal.show();
    $bitcoin.hide();
  } else if(this.value === 'bitcoin') {
      $ccSection.hide();
      $paypal.hide();
      $bitcoin.show();
  } else {
      $ccSection.show();
      $paypal.hide();
      $bitcoin.hide();
  }
}

/*=============-=============-=============-=============
                    EVENT LISTENERS
===============-=============-=============-===========*/

// Job Role Section
$jobRoleMenu.on('change', toggleJobRole);

// T-Shirt Info Section
$designMenu.on('change', displayColorOptions);

// Register for Activities Section
$activitiesInputs.on('change', event => {
  const selectedInput = event.target;

  // Compute and display total amount for checked workshops
  computeActivitesCost(selectedInput);

  // avoid scheduling conflicts
  if(selectedInput.name === 'js-frameworks') avoidSchedulingConflicts($jsFramework, $express);
  if(selectedInput.name === 'express') avoidSchedulingConflicts($express, $jsFramework);
  if(selectedInput.name === 'js-libs') avoidSchedulingConflicts($jsLibs, $node);
  if(selectedInput.name === 'node') avoidSchedulingConflicts($node, $jsLibs);
});

// Payment Info section
$paymentMenu.on('change', displayPaymentSection);