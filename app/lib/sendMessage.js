const express    = require('express');
const mysql 	 = require('mysql');

const app = express();

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

function sendMessage(data){
	/*con.connect(function(err) {
	  	if (err) throw err;
	  	console.log('Connected!');
	});*/
	var sql = 'INSERT INTO Contact (name, email, subject, message) VALUES ("' + data.name + '", "' + data.email + '", "' + data.subject + '", "' + data.message + '")';
	
	con.query(sql, function (err, result) {
	    if (err) throw err;
	});

	/*con.end();*/

	return 'New record created successfully';
}


module.exports.send = sendMessage; 