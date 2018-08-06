/*=============-=============-=============-=============
                    UNOBTRUSIVE JAVASCRIPT
===============-=============-=============-===========*/
$('.activities').append('<p id="total"></p>');
$('.select-method').prop('disabled', true); // Select Payment Method option disabled
$('.cc-option').prop('selected', true); // Credit card payment option selected by default

/*=============-=============-=============-=============
                      CACHED VARIABLES
===============-=============-=============-===========*/

const $name = $('#name').focus(); // Set focus on the first text field

// Job Role Section
const $otherTitle = $('#other-title').addClass('is-hidden');

// T-Shirt Info Section
const $colorOptions = $('#color option');
const $tShirtColorsDiv = $('#colors-js-puns').hide(); //Color menu hidden until T-Shirt design selected

// Register for Activities Section
$activitiesInputs = $('.activities input');
$express = $('.activities input[name="express"]');
$jsFramework = $('.activities input[name="js-frameworks"]');
$jsLibs = $('.activities input[name="js-libs"]');
$node = $('.activities input[name="node"]');
$total = $('#total').hide();
let total = 0; // keeps track of total cost of registered activities

// Payment Info section
$payment = $('#payment');
$creditCard = $('#credit-card');
$paypal = $('.paypal').hide();
$bitcoin = $('.bitcoin').hide();

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

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

/*=============-=============-=============-=============
                    EVENT LISTENERS
===============-=============-=============-===========*/

// Job Role Section
$('#title').on('change', function() {
  if(this.value === 'other') {
    $otherTitle.removeClass('is-hidden');
  } else {
    $otherTitle.addClass('is-hidden');
  }
});

// T-Shirt Info Section
$('#design').on('change', function() {
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
});

// Register for Activities Section
$activitiesInputs.on('change', function() {
  const regex = /\$(\d+)$/; // Regex looks at the end of the line for any numbers preceded by a dollar sign
  const amount = parseInt($(this).parent().text().match(regex)[1]); // grabs cost of activity from activities label
  $total.show();

  // compute and display total amount for checked workshops
  if($(this).prop('checked')) {
    total += amount;
    $total.text(`Total: $${total}`);
    if (total === 0) $total.hide();
  } else {
      total -= amount;
      $total.text(`Total: $${total}`);
      if (total === 0) $total.hide();
  }

  // avoid scheduling conflicts
  if(this.name === 'js-frameworks') avoidSchedulingConflicts($jsFramework, $express);
  if(this.name === 'express') avoidSchedulingConflicts($express, $jsFramework);
  if(this.name === 'js-libs') avoidSchedulingConflicts($jsLibs, $node);
  if(this.name === 'node') avoidSchedulingConflicts($node, $jsLibs);
});

// Payment Info section
$('#payment').on('change', function() {
  if(this.value === 'paypal') {
      $creditCard.hide();
      $paypal.show();
      $bitcoin.hide();
  } else if(this.value === 'bitcoin') {
      $creditCard.hide();
      $paypal.hide();
      $bitcoin.show();
  } else {
      $creditCard.show();
      $paypal.hide();
      $bitcoin.hide();
  }
});