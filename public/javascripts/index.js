window.onload = function() {
  $('.query-form').on('submit', function () {
    text_fields = ['origin', 'destination', 'start-date', 'end-date', 'price-bound'];
    var query_string = "";
    for (item of text_fields) {
      query_string += item + '=' + $('#'+item).val() + '&';
    }

    query_string += 'status=initial&';
    console.log(query_string);

    $.get('/query?'+query_string, function(data) {
      $('body').append(data);

      $('.infinite-scroll').jscroll();
    });

    return false;
  });
};


print = console.log.bind(console);

