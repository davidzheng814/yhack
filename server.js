var $ = 0;
(function () {
  'use strict';

  var env = require('jsdom').env
    , html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>'
    ;

  // first argument can be html string, filename, or url
  env(html, function (errors, window) {
    console.log(errors);

    $ = require('jquery')(window)
      ;

    console.log($('.hello').text());
  });
}());

var url = require('url');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost', // david's ip: 172.26.10.202
  user     : 'dzd123',
  password : ''
});

// ***TO MAKE A QUERY***
// connection.connect();
// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0].solution);
// });
// connection.end();


print = console.log.bind(console);
var results_top = 
"<section class='results'>" + 
"<div class='infinite-scroll'>";

var results_bot = 
"</div>" + 
"</section>";

var item = "<div class='item'> ITEM</div> <div class='next'><a href='/query?status=next'>next</a></div>";
var count = 2;
module.exports = function(request){
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query; // json file {'param':value}
  var status = query['status'];  
  console.log(query);
  
  var search_string = query['search_string'];  

  var a = $("<div class='item'>").append($("<img src='images/nyc1\ copy\ "+count+".jpg' />"));
  var b = $("<div class='next'>").append($("<a href='/query?status=next'>").append('next'));
  item = a[0].outerHTML + b[0].outerHTML;
  
  if (status == 'next'){
    return item;
  }
  return results_top+item+results_bot;
}
