const mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	database: 'Oasis',
	user: 'root',
	password: ''
});

class searchInCatalog{
	full(fields, res){
		
		let sql = 'SELECT * FROM Catalog WHERE ';
		console.log(Object.keys(fields)); 
		switch (fields.searchType){
		case 'search-full':
			sql += '(title LIKE \'%' + fields.query + '%\') OR (author LIKE \'%' + fields.query + '%\') OR (description LIKE \'%' + fields.query + '%\') OR (categories LIKE \'%' + fields.query + '%\')';
			break;
		case 'search-custom-small':
			for (let property in fields){
				if (fields[property] != 'Choose category' && property !='searchType'){
					if (property == Object.keys(fields)[Object.keys(fields).length - 2]){//"-2" because 'search-type' is always last
						sql += '(' + property + ' LIKE \'%' + fields[property] + '%\')';
					} else{
						sql += '(' + property + ' LIKE \'%' + fields[property] + '%\') AND';
					}
				}
			}
			break;
		case 'aside-search':
			sql = this.createSQLQuery(fields);
			break;
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

	createSQLQuery(queryData){
		let sql = 'SELECT * FROM Catalog WHERE ';
		let sqlForQuery = '((title LIKE \'%' + queryData.query + '%\') OR (author LIKE \'%' + queryData.query + '%\') OR (description LIKE \'%' + queryData.query + '%\') OR (categories LIKE \'%' + queryData.query + '%\'))';


		for (let property in queryData){
			if (queryData[property] != '' && property != 'query' && property != 'searchType'){
				let queryPropertyArr = queryData[property].split(', ');

				for (let arrItem of queryPropertyArr) {
					if (sql.includes('LIKE'))
						sql += ' OR (' + property + ' LIKE \'%' + arrItem + '%\')';
					else sql += '(' + property + ' LIKE \'%' + arrItem + '%\')';
				}
			} else if (queryData[property] != '' && property == 'query'){
				if (sql.includes('LIKE'))
					sql += ' OR ' + sqlForQuery;
				else sql += sqlForQuery;
			}
		}

		if (!sql.includes('LIKE')) sql = sql.replace('WHERE', '');

		return sql;
	}

}

module.exports = searchInCatalog;