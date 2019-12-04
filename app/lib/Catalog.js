/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Class
**/

class Catalog{
	search(fields, res){
		/*
		  hp - is short from 'Home page'
		  sp - is short from 'Search page'
		*/

		switch (fields.searchType){
		case 'full-search':
			this.fullSearch(fields)
				.then(result => {
					res.send(JSON.stringify(result));
				});
			break;
		case 'hp-search':
			this.hpSearch(fields)
				.then(result => {
					res.send(JSON.stringify(result));
				});
			break;
		case 'sp-search':
			this.spSearch(fields)
				.then(result => {
					res.send(JSON.stringify(result));
				});
			break;
		}
	}

	fullSearch(fields){
		let sql = `SELECT b.title, b.thumbnailUrl, b.price, b.status, b.id, group_concat(a.author) AS authors 
			FROM Catalog b 
				INNER JOIN BookAuthors ba
					ON b.id = ba.bookId
				INNER JOIN Authors a
					ON ba.authorId= a.id
			where 
				(b.title LIKE '%${fields.query}%') OR 
				(b.id in 
					(select bookId from BookAuthors 
						where BookAuthors.authorId in 
							(select id from Authors where author like '%${fields.query}%')
					)
				) OR 
				(b.description LIKE '%${fields.query}%') OR 
				(b.publisher LIKE '%${fields.query}%') 
			group by b.title;`;

		return new Promise(function(resolve, reject){
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	hpSearch(fields){
		let sql = `SELECT b.title, b.thumbnailUrl, b.price, b.status, b.id, group_concat(a.author) AS authors
			FROM Catalog b 
			    INNER JOIN BookAuthors ba
						ON b.id = ba.bookId
			    INNER JOIN Authors a
						ON ba.authorId= a.id
			where `;

		let authorSQL, titleSQL, categorySQL;

		if (fields.author) {
			sql += `b.id in (
				select bookId from BookAuthors where BookAuthors.authorId in (
					select id from Authors where author like '%${fields.author}%'
				)
			) and`;
		}

		if (fields.title) {
			sql += `b.title like '%${fields.title}%' and`;
		}

		if (fields.category) {
			sql += `b.id in (
				select bookId from BookCategories where BookCategories.categoryId=${fields.category}
			) and`;
		}

		if (sql.endsWith('and')) sql = sql.substring(0, sql.lastIndexOf('and'));
		if (sql.endsWith('where ')) sql = sql.replace('where ', '');

		sql += ' group by b.title;';

		return new Promise(function(resolve, reject){
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	spSearch(fields){
		let queryArr = [];
		let sql = `SELECT b.title, b.thumbnailUrl, b.price, b.status, b.id, group_concat(a.author) AS authors
			FROM Catalog b 
			    INNER JOIN BookAuthors ba
					ON b.id = ba.bookId
			    INNER JOIN Authors a
					ON ba.authorId= a.id
				INNER JOIN BookCategories bc
					ON b.id = bc.bookId
			    INNER JOIN Categories c
					ON bc.categoryId= c.id
			where `;

		if (fields.query){
			sql += `((b.title like '%${fields.query}%') or (b.description like '%${fields.query}%') `;
			if (fields.author){
				sql += ') and ';
			} else sql += `or (a.author like '%${fields.query}%')) and `;
		}

		if (fields.author){
			let authorsQuery = JSON.parse(fields.author); 
			/*authors id's have to be passed inside array*/
			if (Array.isArray(authorsQuery)){
				if (authorsQuery.length > 1) {
					sql += '(a.id in (?)) and ';
					queryArr.push(authorsQuery);
				} else 
					sql += `(a.id= ${authorsQuery}) and `;
			}
		}

		if (fields.categories) {
			let categoriesQuery = JSON.parse(fields.categories); 
			/*categories id's have to be passed inside array*/
			if (Array.isArray(categoriesQuery)){
				if (categoriesQuery.length > 1) {
					sql += '(c.id in (?)) and ';
					queryArr.push(categoriesQuery);
				} else 
					sql += `(c.id= ${categoriesQuery}) and `;
			}	
		}

		if (fields.publisher) {
			let publisherQuery = JSON.parse(fields.publisher); 
			/*publishers names have to be passed inside array*/
			if (Array.isArray(publisherQuery)){
				if (publisherQuery.length > 1) {
					sql += '(publisher in (?)) and ';
					queryArr.push(publisherQuery);
				} else 
					sql += `(publisher= '${publisherQuery}') and `;
			}	
		}

		if (fields.highPrice) {
			sql += '(price <= ' + fields.highPrice + ') and ';
		} 

		if (fields.lowPrice) {
			sql += '(price >= ' + fields.lowPrice + ') and ';
		}

		if (sql.endsWith('and ')) sql = sql.substring(0, sql.lastIndexOf('and '));

		sql += ' group by b.title;';

		return new Promise(function(resolve, reject){
			if (queryArr.length > 0){
				pool.query(sql, queryArr, (err, result) => {
					if (err){
						reject(err);
					} else {
						console.log(result);
						resolve(result);
					}
				});
			} else {
				pool.query(sql, (err, result) => {
					if (err){
						reject(err);
					} else {
						console.log(result);
						resolve(result);
					}
				});
			}
		})
			.catch(err => console.log(err));
	}

	getlowHighPrice(res){
		let sql = 'select min(price) as "low", max(price) as "high" from Catalog';
	
		pool.query(sql, function(err, result){
			if (err) throw err;

			res.send(JSON.stringify(result));
		});
	}

	/*returns full item data*/
	getByColumn(query){
		console.log(query);
		let column = Object.keys(query)[0];

		let sql = `select 
				c.*, group_concat(a.author) as author
			FROM catalog c
			INNER JOIN BookAuthors ba
				ON c.id = ba.bookId
			INNER JOIN Authors a
				ON ba.authorId= a.id 
			where c.${column} = "${query[column]}"
			group by c.title`;
		
		return new Promise(function(resolve, reject){
			//makes a query to db
			pool.query(sql, function (err, result) {
				if (err){
					reject(err);
				} else{
					if (result.length === 1) result = result[0];
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	//gets array of all publishers
	getAllPublishers(){
		return new Promise(function(resolve, reject){
			pool.query('select publisher from Catalog group by publisher', function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result);
				}
			});
		});
	}

	//gets array of all categories
	getAllCategories(){
		return new Promise(function(resolve, reject){
			pool.query('select * from Categories', function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result);
				}
			});
		});
	}

	//gets ID's of  Categories by ID of Book
	getCategoriesId(bookId){
		return new Promise(function(resolve, reject){
			//searches ID's of Categories by ID of Book 
			pool.query(`select categoryId from BookCategories where bookId=${bookId}`, function(err, result){
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	//gets array of book categories
	getCategories(bookId){
		return this.getCategoriesId(bookId)
			.then(data => {
				let promises = [];

				//for every Category ID searches it's name and gathers in array of promises
				for (let item of data) {
					promises.push(new Promise((resolve, reject) => {
						pool.query(`select category from Categories where id=${item.categoryId}`, function(err, category){
							if (err){
								reject(err);
							} else {
								resolve(category[0].Category);
							}
						});
					}));
				}

				//returns array of categories names
				return Promise.all(promises);
			});
	}

	//gets ID's of Books by ID of Category 
	getBooksId(categoryId){
		return new Promise(function(resolve, reject){
			//searches ID's of Books by ID of Category 
			pool.query(`select bookId from BookCategories where categoryId=${categoryId}`, function(err, result){
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	//gets array of books by category id
	getBooks(categoryId){
		return this.getBooksId(categoryId)
			.then(data => {
				let promises = [];

				//for every Book ID searches it's data and gathers in array of promises
				for (let item of data) {
					promises.push(new Promise((resolve, reject) => {
						pool.query(`select id, thumbnailUrl, title, author, price, status from Catalog where id=${item.bookId}`, function(err, category){
							if (err){
								reject(err);
							} else {
								resolve(category[0]);
							}
						});
					}));
				}

				//returns array of books
				return Promise.all(promises);
			});
	}

	//gets array of all authors
	getAllAuthors(){
		return new Promise(function(resolve, reject){
			pool.query('select * from Authors', function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result);
				}
			});
		});
	}

	//gets ID's of  Authors by ID of Book
	getAuthorsId(bookId){
		return new Promise(function(resolve, reject){
			//searches ID's of Categories by ID of Book 
			pool.query(`select authorId from BookAuthors where bookId=${bookId}`, function(err, result){
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	//gets array of book authors
	getAuthor(authorId){
		
	}

	getBook(id){
		let sql = `SELECT b.id, b.title, b.price, group_concat(a.author) AS authors
			FROM Catalog b 
			    INNER JOIN BookAuthors ba
					ON b.id = ba.bookId
			    INNER JOIN Authors a
					ON ba.authorId= a.id
			where b.id=` + id;

sql += ' group by b.title;';

		return new Promise(function(resolve, reject){
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else {
					resolve(result[0]);
				}
			});
		})
			.catch(err => console.log(err));
	}
}

/**
  * Export
**/

module.exports = new Catalog();