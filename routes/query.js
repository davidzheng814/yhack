var express = require('express');
var router = express.Router();
var server = require('../server');

router.get('/', function(req, res, next) {
  result = server(req);
  res.sendFile(__dirname + '/query.html');
});

module.exports = router;
