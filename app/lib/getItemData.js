const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

function getData(req, res){
	var foundedItem = null;
	let sql = 'SELECT * FROM Catalog';
	con.query(sql, function (err, result) {
	    if (err) throw err;
		for (let item of result){
			if (item.title == req.body.name){
				foundedItem = item;
				res.send(JSON.stringify(foundedItem));
				break;
			}
		}
	});
}

module.exports = getData; 