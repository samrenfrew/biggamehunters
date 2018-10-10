// Variable to hold request
var request;

// Bind to the submit event of our form

$('#main_form').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    // handle the invalid form...
  } else {
    // everything looks good!

    // var l = Ladda.create($(this).find("form_submit")[0])
    // l.start();

    // Abort any pending request
    if (request) {
        request.abort();
    }
    // setup some local variables
    var $form = $('#main_form');
    console.log($form);

    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");
    var disabled = $form.find('#uNights').attr('disabled', 'disabled');
    var rNight = '=';

    $.each($('#uNights').val(), function(i, v) {
        rNight = rNight + v + '+';
    });

    // Serialize the data in the form
    var serializedData = $form.serialize();
    serializedData = serializedData + '&uNights' + rNight + '&callback=?';
    console.log(serializedData);

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request to /form.php
    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxqJzYs6lwwb-gU4ChjnN386eS7_3IG9MHixyECKA31NJLQUh0/exec",
        type: "post",
        data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log("Hooray, it worked!!!");
        console.log(response);
        console.log(textStatus);
        console.log(jqXHR);
        $('#main_form').hide();
        $('.application h1').hide();
        $('#bnet_auth').hide();
        $('#main_form_success').show();
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
        $('#main_form_error').show();
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        $inputs.prop("disabled", false);
        // l.stop();
    });
    // Prevent default posting of form
    e.preventDefault();

    $form.find('#uNights').removeAttr('disabled');

  }
})