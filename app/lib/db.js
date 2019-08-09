// Load db module
var mysql = require('mysql');

// Loads connection configs
const {host, user, password, db} = require('./config.js');

// Initialize pool
var pool = mysql.createPool({
	connectionLimit : 10,
	host     : host,
	user     : user,
	password : password,
	database : db,
	debug:  false
});    

module.exports = pool;