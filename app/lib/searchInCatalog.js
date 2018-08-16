const pool = require('./databasePool');

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
				if (fields[property] != '' && fields[property] != 'Choose category' && property !='searchType'){
					sql = this.sqlIncludeOrNot(sql, ' AND ', '(' + property + ' LIKE \'%' + fields[property] + '%\')');
				}
			}
			break;
		case 'aside-search':
			sql = this.createSQLQuery(fields);
			break;
		}
 		
		console.log(sql);
		pool.query(sql, function(err, result){
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

		for (let property in queryData){
			if (queryData[property] != '') {
				if(['title', 'author', 'description', 'categories'].includes(property)){
					let queryPropertyArr = queryData[property].split(', ');
					for (let arrItem of queryPropertyArr) {
						sql = this.sqlIncludeOrNot(sql, ' OR ', '(' + property + ' LIKE \'%' + arrItem + '%\')');
					}
				} else if (property == 'query'){
					let sqlForQuery = '((title LIKE \'%' + queryData.query + '%\') OR (author LIKE \'%' + queryData.query + '%\') OR (description LIKE \'%' + queryData.query + '%\') OR (categories LIKE \'%' + queryData.query + '%\'))';
					sql = this.sqlIncludeOrNot(sql, ' OR ', sqlForQuery);
				} else if (property == 'high-price') {
					sql = this.sqlIncludeOrNot(sql, ' AND ', '(price <= ' + queryData[property] + ')');
				} else if (property == 'low-price') {
					sql = this.sqlIncludeOrNot(sql, ' AND ', '(price >= ' + queryData[property] + ')');
				}
			}
		}

		if (!sql.includes('LIKE') && !sql.includes('>=') && !sql.includes('<=')) sql = sql.replace('WHERE', '');

		return sql;
	}

	sqlIncludeOrNot(sql, andOr, sqlText){
		if (sql.includes('LIKE') || sql.includes('>=') || sql.includes('<='))
			sql += andOr + sqlText;
		else sql += sqlText;
		return sql;
	}
}

module.exports = searchInCatalog;