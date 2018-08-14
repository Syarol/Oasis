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

	byId(callback, id){
		con.query(this.sql, (err, result) => {
		    if (err) return callback(err);
			for (let item of result){
				if (item.id == id){
					callback(null, item);
					break;
				}
			}
		});
	}

	byColumn(column, res){
		let sql = 'SELECT ' + column + ' FROM Catalog';
		let categoriesArray = [];
		con.query(sql, function (err, result) {
		    if (err) throw err;
			for (let item of result){
				let splittedCategories;
				switch(column){
				case 'categories':
					splittedCategories = item.categories.split(', ');
					break;
				case 'author':
					splittedCategories = item.author.split(', ');
					break;
				case 'publisher':
					splittedCategories = item.publisher;
					break;
				}

				if (splittedCategories !== null && typeof splittedCategories !== 'string'){
					for (let category of splittedCategories){
						category.trim();
						if (!categoriesArray.includes(category)){
							categoriesArray.push(category);
						}
					}
				} else{
					if (!categoriesArray.includes(splittedCategories)){
						categoriesArray.push(splittedCategories);
					}
				}
			}

			categoriesArray.sort();

			res.send(JSON.stringify(categoriesArray));
		});
	}
}

module.exports = getCatalogItems;