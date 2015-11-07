window.onload = function() {
  $('.query-form').on('submit', function () {
    text_fields = ['search-string', 'from-date', 'to-date', 'origin'];
    var query_string = "";
    for (item of text_fields) {
      query_string += item + '=' + $('#'+item).val() + '&';
    }
    query_string += 'max-price='+$('#amount').html() + '&';

    query_string += 'status=initial&';
    console.log(query_string);

    $.get('/query?'+query_string, function(data) {
      $('body').append(data);

      $('.infinite-scroll').jscroll();
      $('html, body').animate(
      {
         //get top-position of target-element and set it as scroll target
         scrollTop: $('.infinite-scroll').offset().top,

      },600, function() {
        $('.slideshow, .landing').remove();
      });
    });

    return false;
  });
};


print = console.log.bind(console);

