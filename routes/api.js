var express = require('express');
var db = require('../config/database');
var shortid = require('shortid');
var router = express.Router();

/* GET home page. */
router.get('/polls/:id', function(req, res) {
	res.send(req.params.id);
});

router.post('/polls', function(req, res) {

});

module.exports = router;