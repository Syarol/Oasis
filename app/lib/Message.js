/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Function
**/

class Message {
	/*adds new message from user to database*/
	static send(data){
		let sql = `INSERT INTO Contact (name, email, subject, message) VALUES ("${data.name}", "${data.email}", "${data.subject}", "${data.message}")`;
		
		return new Promise(function(resolve, reject) {
			pool.query(sql, function (err) {
				if (err) {
					reject(err);
				}else {
					console.log('New record created successfully');
					resolve();
				}
			});
		});
	}

	/*gets user message by it id*/
	static getById(id){
		let sql = `select * from Contact where id=${id}`;

		return new Promise(function(resolve, reject) {
			pool.query(sql, function (err, data) {
				if (err) {
					reject(err);
				}else {
					resolve(data);
				}
			});
    })
	}
}

/**
  * Export
**/

module.exports = Message; 