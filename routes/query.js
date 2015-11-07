var express = require('express');
var router = express.Router();
var server = require('../server');

router.get('/', function(req, res, next) {
  server(req, function(result) {
    res.send(result);
  });
});

module.exports = router;
