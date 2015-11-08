window.onload = function() {
  window.scrollTo(0, 0);
  disableScroll();

  $('.query-form').on('submit', function () {
    text_fields = ['search-string', 'from-date', 'to-date', 'origin'];
    var query_string = "";
    for (item of text_fields) {
      var val = $('#'+item).val();
      query_string += item + '=' + $('#'+item).val() + '&';
    }

    query_string += 'max-price='+$('#amount').html() + '&';

    query_string += 'status=initial&';
    console.log(query_string);

    $('.loading').css({
      'display':'block'
    });
    
    enableScroll();
    $('html, body').animate(
      {
         //get top-position of target-element and set it as scroll target
         scrollTop: $('.loading').offset().top,

      },700, "easeInCubic", function() {
        $('.slideshow, .landing').remove();
        $.get('/query?'+query_string, function(data) {
          $('#loading-div').css({
            'display':'none'
          });
          $('.loading').append(data);

          $('.infinite-scroll').jscroll({callback:function(el) {
            console.log('added ', el);
            $(".need-listener").click(function() {
              console.log("clicked");
              $(".specifics", this).toggle("slow");
              $(".dest-types", this).toggle("slow");
            });
            $(".need-listener").removeClass('need-listener');
          }});
        });
    });

    

    return false;
  });
};


print = console.log.bind(console);

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}