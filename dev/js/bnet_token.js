var token;
function token(callback){
    $.ajax({
      url: 'https://biggamehunters.eu/token.json',
      dataType: 'json',
      type: 'GET',
      success: function(data){
        token = data.access_token;
        callback();
      }
    });
}
