const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

class searchInCatalog{
	/*constructor(){
		this.sql = 'SELECT * FROM Catalog';
	}
	
	specialMarked(res, mark){
		let foundedItems = [];
	
		con.query(this.sql, function (err, result) {
		    if (err) throw err;
			for (let item of result){
				if (item.specialMark == mark){
					foundedItems.push(item);
				}
			}
			res.send(JSON.stringify(foundedItems));
		});
	}
*/
	full(fields, res){
		let sql = "SELECT * FROM Catalog WHERE ";
		console.log(Object.keys(fields));  
		for (let property in fields){
			if (fields[property] != '' && property !='search-type'){
				sql += "(" + property + " LIKE '%" + fields[property] + "%')";
			}
		}
		console.log(sql);
		con.query(sql, function(err, result){
			if (err) throw err;

			let foundedItems = [];
			for (let item of result){
				foundedItems.push(item);
			}
			res.send(JSON.stringify(foundedItems));
		});
	}
}

module.exports = searchInCatalog;