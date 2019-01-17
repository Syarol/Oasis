/**
  * Dependencies
**/

const pool = require('./databasePool');

/**
  * Class
**/

class searchInCatalog{
	full(fields, res){
		let sql = 'SELECT * FROM Catalog WHERE ';

		/*
		  shp - is short from 'Shop page'
		  hp - is short from 'Home page'
		  sp - is short from 'Search page'
		*/
		switch (fields.searchType){
		case 'shp-full-search':
			sql += '(title LIKE \'%' + fields.query + '%\') OR (author LIKE \'%' + fields.query + '%\') OR (description LIKE \'% ' + fields.query + ' %\') OR (categories LIKE \'%' + fields.query + '%\')';
			break;
		case 'hp-custom-search':
			for (let property in fields){
				if (fields[property] != '' && fields[property] != 'Choose category' && property !='searchType'){
					sql = this.sqlIncludeOrNot(sql, ' AND ', '(' + property + ' LIKE \'%' + fields[property] + '%\')');
				}
			}
			break;
		case 'sp-search':
			sql = this.createSQLQuery(fields);
			break;
		}
 		
		console.log(sql);
		if (sql == 'SELECT * FROM Catalog WHERE '){
			sql = 'SELECT * FROM Catalog';
		}

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
			console.log(queryData[property]);
			if(['title', 'author', 'description', 'categories', 'publisher'].includes(property)){
				let queryPropertyArr = queryData[property].split(', ');
				for (let arrItem of queryPropertyArr) {
					sql = this.sqlIncludeOrNot(sql, ' OR ', '(' + property + ' LIKE \'%' + arrItem + '%\')');
				}
			} else if (property == 'query'){
				let sqlForQuery = '((title LIKE \'%' + queryData.query + '%\') OR (author LIKE \'%' + queryData.query + '%\') OR (description LIKE \'% ' + queryData.query + ' %\') OR (categories LIKE \'%' + queryData.query + '%\'))';
				sql = this.sqlIncludeOrNot(sql, ' OR ', sqlForQuery);
			} else if (property == 'highPrice') {
				sql = this.sqlIncludeOrNot(sql, ' AND ', '(price <= ' + queryData[property] + ')');
			} else if (property == 'lowPrice') {
				sql = this.sqlIncludeOrNot(sql, ' AND ', '(price >= ' + queryData[property] + ')');
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

	lowHighPrice(res){
		let sql = 'select min(price) as "low", max(price) as "high" from Catalog';
	
		pool.query(sql, function(err, result){
			if (err) throw err;

			res.send(result);
		});
	}
}

module.exports = searchInCatalog;