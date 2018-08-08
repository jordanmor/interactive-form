/*=============-=============-=============-=============
                    UNOBTRUSIVE JAVASCRIPT
===============-=============-=============-===========*/
$('.activities').append('<p id="total"></p>');
$('.select-method').prop('disabled', true); // Select Payment Method option disabled
$('.cc-option').prop('selected', true); // CC payment option selected by default

// Form validation messages
$('form').prepend('<p class="error-message form-error">Please enter all required fields</p>');
$('#name').after('<p class="error-message name-error">Please enter a name</p>');
$('#mail').after('<p class="error-message mail-error">Please enter an email</p>');
$('#other-title').after('<p class="error-message other-title-error">Please enter a job role</p>');
$('.cc-info').after(`<div class="col-12 col">
                        <p class="error-message cc-num-error">Please enter a valid credit card number</p>
                        <p class="error-message zip-error">Please enter a valid zip code</p>
                        <p class="error-message cvv-error">Please enter a valid cvv code</p>
                     </div>`);
$('.activities legend').append('<span class="error-message activities-error">- Please choose at least one activity -</span>');
$('.exp-year-label').hide(); // hides CC expiration year label to help better display error messages
$('.error-message').hide(); // Hide all error messages when page loads

/*=============-=============-=============-=============
                      CACHED VARIABLES
===============-=============-=============-===========*/

const $name = $('#name').focus(); // Sets focus on the first text field

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
let total = 0; // Keeps track of total cost of registered activities

// Payment Info Section
const $paymentMenu = $('#payment');
const $ccSection = $('#credit-card');
const $paypal = $('.paypal').hide();
const $bitcoin = $('.bitcoin').hide();

// Form Validation Section
const $inputs = $('input[type=text], input[type=email]');
const $form = $('form');

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

// ---- Job Role Section ---- //

function toggleJobRole() {
  if(this.value === 'other') {
    $otherTitle.removeClass('is-hidden');
  } else {
    $otherTitle.addClass('is-hidden').removeClass('error valid');
    $('.other-title-error').hide(); // Hide error message when other option is not selected
  }
}

// ---- T-Shirt Info Section ---- //

function displayColorOptions() {
  if(this.value === 'js puns') {
    $tShirtColorsDiv.show();
    $colorOptions
      .prop('selected', false) // No options selected so first 'JS Puns' option will appear
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
        .prop('selected', true); // First filtered 'I ♥ JS' option selected 
  } else {
      $tShirtColorsDiv.hide(); // Color menu hidden if no theme selected
  }
}

// ---- Register for Activities Section ---- //

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
  const amount = parseInt($(input).parent().text().match(regex)[1]); // Grabs parsed cost of activity from activities label
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

// ---- Payment Info section ---- //

function displayPaymentSection() {
  if (this.value !== 'credit card') {
    // When CC option is not selected, remove all CC inputs 'error' & 'valid' classes
    $('#cc-num, #zip, #cvv').removeClass('error valid').val('');
    $ccSection.find('.error-message').hide(); // hide error messages
    // If main form error message displayed, hide if no inputs have 'error' class
    if ( $inputs.filter((i, input) => input.className === 'error').length === 0) {
      $('.form-error').hide();
    }
    if(this.value === 'paypal') {
      $ccSection.hide();
      $paypal.show();
      $bitcoin.hide();
    } else if(this.value === 'bitcoin') {
        $ccSection.hide();
        $paypal.hide();
        $bitcoin.show();
    }
  } else {
      $ccSection.show();
      $paypal.hide();
      $bitcoin.hide();
  }
}

// ---- Form validation Section ---- //

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// This function makes sure that at least one activity is registered
function activityRegistered() {
  return $('.activities input:checked').length > 0; // No checked activites returns false, otherwise true;
}

// Simple validation for purposes of project
function validateCC(id, value) {
  if (id === 'cc-num') {
      return /^\d{13,16}$/.test(value); // 13 - 16 numbers only for cc
  } else if (id === 'zip') {
      return /^\d{5}$/.test(value); // 5 numbers only for zip
  } else if (id === 'cvv') {
      return /^\d{3}$/.test(value); // 3 numbers ony for cvv
  }
}

// Adds a class of 'error' to highlight input & display's corresponding error message
function showError(id, el, message) {
  $(el).removeClass('valid').addClass('error');
  $(`.${id}-error`).show();
  if (message) {
      $(`.${id}-error`).text(message);
  }
}

// Removes 'error' class from input and hides error message
function hideError(id, el) {
  $(el).removeClass('error');
  $(`.${id}-error`).hide();
}

// Adds a class of valid that highlights input and hides error message and class
function addValidClass(id, el) {
  hideError(id, el);
  $(el).addClass('valid');
}

// Provides real-time validation error messages for text input fields
function validateInput(event) {
  const selectedInput = event.target;
  const id = selectedInput.id;
  const value = selectedInput.value;
  const digits = value.toString().length; // digits used to validate credit card fields
  const type = event.type; // used to distinguish between keyup and blur events
  let message = '';

  // Hide main form error message if no inputs have the class 'error' & at least 1 activity registered
  if ( $inputs.filter((i, input) => input.className === 'error').length === 0 && activityRegistered()) {
    $('.form-error').hide();
  }
  // handles validation of name field & job role field (only if that option is selected)
  if (id === 'name' || ( id === 'other-title' && !$otherTitle.hasClass('is-hidden')) ) {
      value !== '' ? addValidClass(id, selectedInput) : showError(id, selectedInput);
  }
  // Email and CC validation
  if (type === 'keyup') {
      if (id === 'mail' && validateEmail(value)){
          addValidClass(id, selectedInput);
      } else if ( id === 'cc-num' || id === 'zip' || id === 'cvv') {
          // First CC validation creates error message if user types more than maximum defined digits
          if (id === 'cc-num' && digits > 16 || id === 'zip' && digits > 5 || id === 'cvv' && digits > 3 ) {
              showError(id, selectedInput);
          // Second CC validation uses validateCC function to make sure user input is a specific amount of numbers only
          } else if (validateCC(id, value)) {
              addValidClass(id, selectedInput); 
          }
      }
  } else if (type === 'blur') {
      if (id === 'mail' && value === '') {
          message = 'Please enter an email address'; // Conditional email error message
          showError('mail', selectedInput, message);            
      } else if (id === 'mail' && !validateEmail(value)){
          message = 'Please enter a valid email address'; // Conditional email error message
          showError(id, selectedInput, message);
      } else if ( id === 'cc-num' || id === 'zip' || id === 'cvv') {
          // Error message will show on blur event on invalid CC input
          if(!validateCC(id, value)) {
              showError(id, selectedInput);
          }
      }
  } 
}

// Form can only be submitted once all input fields are valid
function validateForm(event) {
  let inputs = $inputs.length; // Total of all text/email inputs
  let validInputs = $inputs.filter((i, input) => input.className === 'valid').length; // Total inputs with class 'valid'

  if ($otherTitle.hasClass('is-hidden')) inputs--; // When not selected, Job Role input not counted in total inputs
  if ($paymentMenu.val() !== 'credit card') inputs-= 3; // When CC not selected, CC inputs not counted in total inputs

  // When total valid inputs = total inputs & at least one activity is registered, form can be submitted
  if(validInputs === inputs && activityRegistered()) {
    return;
  } else {
      // Otherwise, form submission is blocked. Form, activity field and all invalid inputs show error messages
      event.preventDefault();
      $('.form-error').show();
      if( !activityRegistered() ) $('.activities-error').show();

      // Add the 'error' class to all inputs that do not have the class 'valid'
      $inputs.filter((i, input) => {
        const id = input.id;
        if( id === 'cc-num' || id === 'zip' || id === 'cvv') {
          // Do not include CC inputs if CC option not selected from Payment Info menu
          return $paymentMenu.val() !== 'credit card' ? false : input.className !== 'valid';
        } else if(id === 'other-title') {
            // Do not include job role input if option is not selected or has class 'valid'
            return input.className !== 'is-hidden' && input.className !== 'valid';
        } else {
          return input.className !== 'valid';
        }
      }).addClass('error');
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

  // If activity error message displayed, hide when an activity is selected
  $('.activities-error').hide();
  // If main form error message displayed, hide if no inputs have 'error' class
  if ( $inputs.filter((i, input) => input.className === 'error').length === 0) {
    $('.form-error').hide();
  }

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

// Form Validation Section
$inputs.on('keyup blur', validateInput);
$form.on('submit', validateForm);