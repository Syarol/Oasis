/**
  * Dependencies
**/

const pool = require('./databasePool');

/**
  * Class
**/

class getCatalogItems{
	/*returns full item data*/
	bySimpleColumn(query, res, callback = false){
		let sql = 'SELECT * FROM Catalog';
		let column = Object.keys(query)[0];
		//makes a query to db
		pool.query(sql, function (err, result) {
			if (err) throw err;
			let foundedItems = [];

			//
			for (let item of result){
				if (item.hasOwnProperty(column) && item[column] == query[column]){
					foundedItems.push(item);
				}
			}

			//if callback function passed to function then executes it, else - sends the response to client
			if(callback){
				callback(err, foundedItems);
			} else
				res.send(JSON.stringify(foundedItems));
		});
	}

	/*returns only one column data of item*/
	byColumn(column, res){
		let sql = 'SELECT ' + column + ' FROM Catalog';
		let categoriesArray = [];
		pool.query(sql, function (err, result) {
		    if (err) throw err;
			for (let item of result){
				let splittedCategories;
				switch(column){
				case 'categories':
				case 'author':
					splittedCategories = item[column].split(', ');
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