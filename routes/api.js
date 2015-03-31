var express = require('express');
var db = require('../config/database');
var shortid = require('shortid');
var router = express.Router();
var http = require('http');

// GET Polls
router.get('/polls/:id', function(req, res) {
	db.get('polls', req.params.id)
	.then(function(result){
		res.json(result.body);
	})
	.fail(function(error){
		console.log("Error retriving the poll: " + error)
	});
});

// POST Polls
router.post('/polls', function(req, res) {
	console.log('Saving a new Poll');
	var id = shortid.generate();
	for(var i=0; i<req.body.choices.length; i++){
		req.body.choices[i].votes = new Array();
	}
	req.body.createdAt = Date.now();
	req.body.active = true;
	db.put('polls', id, req.body)
	.then(function(poll){
		res.send(id);
	})
	.fail(function(error){
		console.log("Error storing the poll: " + error);
	});
});

// PUT Polls
router.put('/polls/:id', function(req,res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var options = {
		host: 'https://freegeoip.net/json/' + ip,
		port: 80
	};
	var location = http.get(options, function(getResult){
		console.log(location);
	}).on('error', function(err){
		console.log("Can't locate the ip");
	});
	// TODO: Memorizzare IP e citta' e metterli nella lista di chi ha votato il messaggio
	db.put('polls', req.params.id, req.body)
	.then(function(result){
		res.send(req.params.id);
	}).fail(function(error){
		console.log('Error updating the poll: ' + error);
	});
});

module.exports = router;