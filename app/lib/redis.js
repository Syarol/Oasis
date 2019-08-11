//load redis module
const redis = require('redis');

//gets redis server url
const {redisUrl} = require('./config.js');

//creates a new client
const client = redis.createClient(redisUrl);

/**
 * Client listeners 
**/

client.on('connect', function() {
	console.log('Redis client connected');
});

client.on('error', function (err) {
	console.log('Something went wrong: ' + err);
});

/**
 * Export 
**/

module.exports = {
	redisClient: client
};