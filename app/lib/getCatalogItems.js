const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

class getCatalogItems{
	constructor(){
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

	categories(res){
		let sql = 'SELECT categories FROM Catalog';
		let categoriesArray = [];
		con.query(sql, function (err, result) {
		    if (err) throw err;
			for (let item of result){
				let splittedCategories = item.categories.split(', ');
				for (let category of splittedCategories){
					category.trim();
					if (!categoriesArray.includes(category)){
						categoriesArray.push(category);
					}
				}
			}

			categoriesArray.sort();

			res.send(JSON.stringify(categoriesArray));
		});
	}
}

module.exports = getCatalogItems;