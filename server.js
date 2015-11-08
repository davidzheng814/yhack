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
    // console.log($('.item').text());
  });
}, 1000);

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

  renderFlights = function(groups, start, len) {
    code_to_city = {'JFK': 'New York', 'PAP': 'Port Au Prince', 'BGI': 'Bridgetown', 'BOS': 'Boston', 'OAK': 'Oakland', 'NAS': 'Nassau', 'LIR': 'Liberia', 'SJC': 'San Jose', 'BOG': 'Bogota', 'SXM': 'Saint Maarten', 'DCA': 'Washington DC', 'LIM': 'Lima', 'BWI': 'Baltimore', 'PIT': 'Pittsburgh', 'SAV': 'Savannah', 'JAX': 'Jacksonville', 'BQN': 'Aguadilla', 'IAD': 'Washington DC', 'CHS': 'Charleston', 'PHL': 'Philadelphia', 'SFO': 'San Francisco', 'PHX': 'Phoenix', 'LAX': 'Los Angeles', 'KIN': 'Kingston', 'LAS': 'Las Vegas', 'FLL': 'Fort Lauderdale', 'DEN': 'Denver', 'DTW': 'Detroit', 'SYR': 'Syracuse', 'BUR': 'Burbank', 'ROC': 'Rochester', 'BUF': 'Buffalo', 'UVF': 'St. Lucia', 'BDA': 'Hamilton', 'BDL': 'Windsor Locks', 'GCM': 'Grand Cayman', 'EWR': 'Newark', 'PBI': 'West Palm Beach', 'BTV': 'Burlington', 'RNO': 'Reno', 'ANC': 'Anchorage', 'LRM': 'La Romana', 'PSE': 'Ponce', 'RDU': 'Raleigh/Durham', 'ACK': 'Nantucket', 'CTG': 'Cartagena', 'SMF': 'Sacramento', 'MDE': 'Medellin', 'PVD': 'Providence', 'SEA': 'Seattle', 'AUA': 'Aruba', 'CUR': 'Curacao', 'PDX': 'Portland', 'CLE': 'Cleveland', 'DFW': 'Fort Worth/Dallas', 'SJU': 'San Juan', 'AUS': 'Austin', 'SRQ': 'Sarasota', 'SJO': 'San Jose', 'CLT': 'Charlotte', 'CUN': 'Cancun', 'PLS': 'Providenciales', 'PUJ': 'Punta Cana', 'RIC': 'Richmond', 'ORH': 'Worcester', 'ORD': 'Chicago', 'HYA': 'Hyannis', 'MSY': 'New Orleans', 'SWF': 'Stewart Field/Newburgh', 'GND': 'Grenada', 'AZS': 'Samana', 'TPA': 'Tampa', 'MBJ': 'Montego Bay', 'POS': 'Trinidad', 'POP': 'Puerto Plata', 'MVY': "Martha's Vineyard", 'STI': 'Santiago', 'STT': 'St. Thomas Island', 'ABQ': 'Albuquerque', 'HOU': 'Houston', 'HPN': 'Westchester County', 'STX': 'St. Croix Island', 'SLC': 'Salt Lake City', 'MCO': 'Orlando', 'PWM': 'Portland', 'SDQ': 'Santo Domingo', 'LGB': 'Long Beach', 'LGA': 'New York', 'RSW': 'Fort Myers'}
    var idx = start;
    // ret is a temp. container; not actually rendered in the end
    var ret = $('<div>');
    while (idx < start + len && idx < groups.length) {
      var group = groups[idx]; // group: represents a bundle of flights with same FROM, DEST.
      rep_row = group[0]; // representative flight
      // var el = $("<div class='item'>");
      $('.origin-destination').html(code_to_city[rep_row.Origin] + " (" + rep_row.Origin + ") to " + code_to_city[rep_row.Destination] + " (" + rep_row.Destination + ")");
      $('.flight-cost').html("Starting at $" + rep_row.DollarTotal.toString());
      var el = $('.item').clone();
      el.addClass('need-listener');
      ret.append(el);
      ++idx;
    }

    // TODO: concurrency = lol
    ++cnt;
    sql_queries[''+cnt] = sql_query;
    nextParams = 'status=next&id='+cnt+'&start='+idx;

    if (idx < groups.length) {
      var b = $("<div class='next'>").append($("<a href='/query?" + nextParams + "'>").append('next'));
      ret.append(b);
    }
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

      var dict = {};
      // dict.hi // dict['hi'] dict[x] dict.x = dict['x']
      for (var row of rows) {
        var dest = row.Destination;
        if (dest in dict) {
          dict[dest].push(row);
        } else {
          dict[dest] = [row];
        }
      }
      groups = [];
      for (var dest in dict) {
        group = dict[dest];
        compareFunc = function(a, b) {
          return a.DollarTotal - b.DollarTotal;
        }
        group.sort(compareFunc);
        groups.push(group);
        if (group.length > 25) {
          group.splice(25, group.length - 25);
        }
      }
      console.log(groups);

      // TODO: concurrency = lol
      prev_query = sql_query;
      prev_result = groups;

      callback(renderFlights(prev_result, start, len));
    });
  }
}
