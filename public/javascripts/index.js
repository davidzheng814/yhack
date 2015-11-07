window.onload = function() {
  $('.query-form').on('submit', function () {
    var search_string = $('#search-string').val();

    query_string = 'search_string='+search_string;
    $.get('/query?'+query_string, function(data) {
      $('body').append(data);

      $('.infinite-scroll').jscroll();
    });

    return false;
  });
};


print = console.log.bind(console);

