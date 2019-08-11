/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Function
**/

function sendMessage(data){
	var sql = 'INSERT INTO Contact (name, email, subject, message) VALUES ("' + data.name + '", "' + data.email + '", "' + data.subject + '", "' + data.message + '")';
	
	pool.query(sql, function (err) {
	    if (err) throw err;
	});

	return 'New record created successfully';
}

/**
  * Export
**/

module.exports = sendMessage; 