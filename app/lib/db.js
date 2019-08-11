// Load db module
var mysql = require('mysql');

// Loads connection configs
const {dbHost, dbUser, dbPassword, db} = require('./config.js');

// Initialize pool
var pool = mysql.createPool({
	connectionLimit : 10,
	host     : dbHost,
	user     : dbUser,
	password : dbPassword,
	database : db,
	debug:  false
});    

/**
  * Export
**/

module.exports = pool;