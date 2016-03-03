$(document).ready(function() {

  $('#variable1').on('change', function(e) {
    // console.log(e);
    var val = e.target.value;
    $('h1').text(val);
    $('#box').css({"height": val, "width": val});
  })


})
