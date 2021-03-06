var atTop = true;
function backToTop(){
  if(atTop)
    return;
  atTop = true;
  $('body').animate(
    {
       //get top-position of target-element and set it as scroll target
       scrollTop: $('.landing').offset().top,
  },400, function() {
    disableScroll();
    $('.results').remove();
  });
  $('.nav-bar').css({
      'display':'none'
  });
  window.onscroll = function () {};
};

window.onload = function() {
  window.scrollTo(0, 0);
  disableScroll();
  var searchStringTags = {'domestic':'domestic', 'california':'3-1', 'caribbean':'3-2', 'mid-atlantic':'3-3', 'mountain/desert':'3-4','northeast':'3-5', 'south/southwest':'3-6','beach':'1-1', 'exploration':'1-2', 'family':'1-3', 'nightlife':'1-4', 'romance':'1-5', 'other caribbean islands':'2-3', 'puerto rico':'2-4', 'dominican republic':'2-5', 'colombia':'2-6', 'the south':'2-8', 'mountain west':'2-9', 'desert west':'2-10', 'pacific northwest':'2-11', 'midwest':'2-15', 'gulf':'2-19', 'texas':'2-20'};

  if(typeof(String.prototype.trim) === "undefined")
  {
      String.prototype.trim = function() 
      {
          return String(this).replace(/^\s+|\s+$/g, '');
      };
  }

  $('.nav-bar').click(backToTop);

  $('.query-form').on('submit', function () {
    text_fields = ['search-string', 'from-date', 'to-date', 'origin'];
    var query_string = "";
    for (item of text_fields) {
      var val = $('#'+item, this).val();
      if (item == 'origin') {
        try {
          val = val.substring(val.indexOf('(') + 1, val.indexOf(')'));
        } catch (e) {
          // val not formatted from auto-complete
        }
      }else if (item == 'search-string') {
        var tokens = val.split(',');
        val = "";
        for (token of tokens) {
          token = token.trim().toLowerCase();
          if (token == '')
            continue;
          if (token.indexOf('(') != -1) {
            token = token.substring(token.indexOf('(') + 1, token.indexOf(')'));
            val += token + ',';
          } else {
            if (token in searchStringTags) {
              val += searchStringTags[token] + ',';
            }
          }
        }
      }
      query_string += item + '=' + val + '&';
    }

    query_string += 'max-price='+$('#amount').html() + '&';

    query_string += 'status=initial&';
    console.log(query_string);

    $('.loading').css({
      'display':'block'
    });

    addListeners = function() {
      
      $('.need-slick').slick({
        autoplay:true,
        arrows:false,
      });
      $('.need-slick').removeClass('need-slick');
      console.log('slick worked');
      $(".need-listener").click(function() {
        $(".specifics", this).toggle("slow");
        // $(".dest-types", this).toggle("slow");
        var fd = $(".flight-data", this);
        if (!fd.hasClass("show")) {
          setTimeout(function () {fd.removeClass("hide"); 
                                  fd.addClass("show")}, 650);
        } else {
          fd.addClass("hide");
          fd.removeClass("show");
        }
      });
      $(".need-listener").removeClass('need-listener');
    }

    atTop = false;
    enableScroll();
    $('body').animate(
      {
         //get top-position of target-element and set it as scroll target
         scrollTop: $('.loading').offset().top,

      },700, "easeInCubic", function() {
        // search_string = $('#search-string').val();
        // from_date = $('#from-date').val();
        // to_date = $('#to-date').val();
        // origin = $('#origin').val();
        // amount = $('#amount').html();
        // console.log(search_string+' '+from_date+' '+to_date+' '+origin+' '+amount);

        // put values into boxes


        // $('.slideshow, .landing').remove();
        $('.nav-bar').css({
          'display':'block'
        });
        window.onscroll = function () {
          if(!atTop && document.body.scrollTop < 3*window.innerHeight/4) {
            backToTop();
          }
        }
        $.get('/query?'+query_string, function(data) {
          $('#loading-div').css({
            'display':'none'
          });
          $('.loading').append(data);

          $('.infinite-scroll').jscroll({
            padding: 1200,
            callback: addListeners});
          $('body').attr('style', 'padding-top: 45px');
          addListeners();
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