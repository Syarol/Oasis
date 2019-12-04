/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Class
**/

class Order{
	new(userId, items){
		return new Promise(function(resolve, reject){
			let orderNumberSQL = `INSERT INTO userorders (userId) values (${userId});`;

			pool.query(orderNumberSQL, function(err, result) {
				if (err){
					reject(err);
				} else {
					let orderedSQL = '';
					for (let item of items){
						orderedSQL += `INSERT INTO orders (bookId, count, orderId) values (${item.id}, ${item.count}, ${result.insertId});`;
					}

					pool.query(orderedSQL, function(err){
						if (err){
							reject(err);
						} else {
							resolve(true);
						}
					});
				}
			});
		})
			.catch(err => console.log(err));
	}

	getAll(userId){
		return new Promise(function(resolve, reject){
			let sql = `select userorders.*, orders.bookId, orders.count from userorders
				right join orders
					on userorders.id = orders.orderId
				where userorders.userId =` + userId;

			pool.query(sql, function(err, result) {
				if (err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}
}

/**
  * Export
**/

module.exports = new Order();