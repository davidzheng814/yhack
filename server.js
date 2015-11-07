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

module.exports = function(request){
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query; // json file {'param':value}
  console.log(query);
}
