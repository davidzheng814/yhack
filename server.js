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

var results_top = 
"<section class='results'>" + 
"<div class='infinite-scroll'>";

var results_bot = 
"</div>" + 
"</section>";

var item = "<div class='item'> ITEM</div> <div class='next'><a href='/query?query_string=next'>next</a></div>";

module.exports = function(request){
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query; // json file {'param':value}
  var search_string = query['search_string'];  

  if (search_string == 'next'){
    console.log('hi');
    return item;
  }

  return results_top+item+results_bot;
}
