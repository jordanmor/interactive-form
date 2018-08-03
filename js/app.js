/*=============-=============-=============-=============
                    UNOBTRUSIVE JAVASCRIPT
===============-=============-=============-===========*/

/*=============-=============-=============-=============
                      CACHED VARIABLES
===============-=============-=============-===========*/

const $name = $('#name').focus(); // Set focus on the first text field

// Job Role Section
const $otherTitle = $('#other-title').addClass('is-hidden');
// T-Shirt Info Section
const $colorOptions = $('#color option');
const $tShirtColorsDiv = $('#colors-js-puns').hide(); //Color menu hidden until T-Shirt design selected

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/


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
      $colorOptions.prop('selected', false) // no options selected so first 'JS Puns' option will appear
                   .hide()
                   .filter((i, option) => option.textContent.includes('JS Puns'))
                   .show();
  } else if(this.value === 'heart js') {
      $tShirtColorsDiv.show();
      $colorOptions.hide()
                   .filter((i, option) => option.textContent.includes('I ♥ JS'))
                   .show()
                   .first()
                   .prop('selected', true); // the first filtered 'I ♥ JS' option selected 
  } else {
      $tShirtColorsDiv.hide(); //Color menu hidden if no theme selected
  }
});