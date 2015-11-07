// set up dummy html env to use jquery in
// we only actually use $ to create html elements programmatically

print = console.log.bind(console);
var fs = require("fs");
var fileName = "item.html";

var sandbox_html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

fs.exists(fileName, function(exists) {
  if (exists) {
    fs.stat(fileName, function(error, stats) {
      fs.open(fileName, "r", function(error, fd) {
        var buffer = new Buffer(stats.size);

        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
          var data = buffer.toString("utf8", 0, buffer.length);

          sandbox_html = data;
          fs.close(fd);
        });
      });
    });
  }
});

print ('creating $');

var $ = 0;

setTimeout(function () {
  'use strict';

  var env = require('jsdom').env;
  // first argument can be html string, filename, or url
  env(sandbox_html, function (errors, window) {
    $ = require('jquery')(window);

    console.log($('.flight_data').text());
  });
}, 100);

var url = require('url');
var mysql = require('mysql');
var connection = mysql.createConnection({
  // host     : 'localhost', // david's ip: 172.26.10.202
  host     : '172.26.10.202',
  user     : 'root',
  password : '' // TODO: make this read from config
});

try {
connection.connect();
// connection.end();
} catch(e) {
  print('cannot connect to server');
}


var results_top = 
"<section class='results'>" + 
"<div class='infinite-scroll'>";

var results_bot = 
"</div>" + 
"</section>";

// lenn: number of flights scrolled into view per scroll
var len = 3; 

// caching-ish stuff
// TODO: make it a more legit real cache
var sql_queries = {};
var prev_query;
var prev_result;

// assign each query an id (current cnt)
var cnt = 0;

module.exports = function(request, callback) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query; // json file {'param':value}
  var status = query['status'];
  var search_string = query['search_string'];

  var sql_query;
  if (status == 'next') {
    sql_query = sql_queries[query.id];
  } else {
    // TODO: modify this to sort by a relevancy/preference metric
    sql_query = "SELECT * FROM flights.data WHERE origin = '" + query.origin + "'";
  }
  var start = 0;
  if (status == 'next') {
    start = parseInt(query.start);
  }

  renderFlights = function(rows, start, len) {
    var idx = start;
    // ret is a temp. container; not actually rendered in the end
    var ret = $('<div>');
    while (idx < start + len && idx < rows.length) {
      var row = rows[idx];
      var el = $("<div class='item'>");

      // el holds a flight. 
      // TODO: make it pretty
      originDestination = $("<div class='origin-destination'>").append("Boston (BOS) to New York City (JFK)");
      el.append(originDestination);

      el.append(JSON.stringify(row));

      ret.append(el);
      ++idx;
    }

    // TODO: concurrency = lol
    ++cnt;
    sql_queries[''+cnt] = sql_query;
    nextParams = 'status=next&id='+cnt+'&start='+idx;

    var b = $("<div class='next'>").append($("<a href='/query?" + nextParams + "'>").append('next'));
    ret.append(b);
    if (start == 0) {
      return results_top+ret.html()+results_bot;
    } else {
      return ret.html();
    }
    // TODO: if idx == rows.length, return 'no more flights' aka infinite scroll -> finite page
  }

  if (prev_query == sql_query) {
    callback(renderFlights(prev_result, start, len));
  } else {
    connection.query(sql_query, function(err, rows, fields) {
      if (err) throw err;

      // sort rows
      rows.sort(function(a, b) {
        // return 1 if flight a should go before b
        // return 0 otherwise
        return a.DollarTotal < b.DollarTotal;
      });

      // TODO: concurrency = lol
      prev_query = sql_query;
      prev_result = rows;

      callback(renderFlights(prev_result, start, len));
    });
  }
}
