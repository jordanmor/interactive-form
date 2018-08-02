/*=============-=============-=============-=============
                    UNOBTRUSIVE JAVASCRIPT
===============-=============-=============-===========*/

/*=============-=============-=============-=============
                      CACHED VARIABLES
===============-=============-=============-===========*/

$name = $('#name').focus(); // Set focus on the first text field

// Job Role Section
const $otherTitle = $('#other-title').addClass('is-hidden');

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
