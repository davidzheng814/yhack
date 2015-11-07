var url = require('url');

module.exports = function(request){
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query; // json file {'param':value}
  console.log(query);
}
