const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

function sendMessage(data){
	var sql = 'INSERT INTO Contact (name, email, subject, message) VALUES ("' + data.name + '", "' + data.email + '", "' + data.subject + '", "' + data.message + '")';
	
	con.query(sql, function (err) {
	    if (err) throw err;
	});

	return 'New record created successfully';
}


module.exports = sendMessage; 