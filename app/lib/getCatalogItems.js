const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

class getCatalogItems{
	arrivals(req, res){
		let arrivalItems = [];

		let sql = 'SELECT * FROM Catalog';
		con.query(sql, function (err, result) {
		    if (err) throw err;
			for (let item of result){
				if (item.specialMark == 'ARRIVALS'){
					arrivalItems.push(item);
				}
			}
			res.send(JSON.stringify(arrivalItems));
		});
	}
}

module.exports = getCatalogItems;