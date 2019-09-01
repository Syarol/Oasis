/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Class
**/

class User{
	static register(data){
		let sql = `INSERT INTO Users (firstName, lastName, email, password) VALUES ('${data.firstName}', '${data.lastName}', '${data.email}', '${data.password}')`;

		pool.query(sql, function (err) {
		    if (err) throw err;
			console.log('New user created successfully');
		});

		return this;
	}

	static isUniqueUsed(type, value){
		let sql = `SELECT 1 FROM Users WHERE ${type}='${value}'`;
		return new Promise(function(resolve, reject){
			pool.query(sql, function (err, result) {
			    if (err){
			    	reject(err);
			    } else{
					if (result[0]) {
			    		resolve(true);
					} else resolve(false);
			    }
			});
		})
			.catch(err => console.log(err));
	}

	static logIn(reqData){
		return new Promise(function(resolve, reject){
			let authData = JSON.parse(Buffer.from(reqData.split(' ')[1], 'base64').toString());
			let email = Object.keys(authData)[0];
			let password = authData[Object.keys(authData)[0]];

			let sql = `SELECT id FROM Users WHERE (email='${email}' and password='${password}')`;

			pool.query(sql, function (err, result) {
			    if (err){
			    	reject(err);
			    } else{
					if (result[0]) {
						resolve(result[0].id);
					} else resolve(false);
			    }
			});
		})
			.catch(err => console.log(err));
	}

	static logOut(req){
		if (req.session) {
		    req.session.destroy(function(err) {
		      if(err) throw err;
		    });
		}
	}

	static getAllData(userId){
		return new Promise((resolve, reject) => {
			let sql = `select * from users where id=${userId}`;
			pool.query(sql, function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result[0]);
				}
			});
		})
			.catch(err => console.log(err));
	}

	static updateLogin(login, userId){
		return new Promise((resolve, reject) => {
			let sql = `update users set login= ${login} where id=${userId}`;
			pool.query(sql, function(err, result){
				if (err){
					reject(err);
				} else{
					console.log(result);
					resolve(result);
				}
			});
		})
			.catch(err => console.log(err));
	}

	/*gets password of currently authorised user*/
	static getPassword(req){
		return new Promise((resolve, reject) => {
			let sql = `select password from users where id=${req.session.user}`;
			pool.query(sql, function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result[0].password);
				}
			});
		})
			.catch(err => console.log(err));
	}

	/*changes users password*/
	static changePassword(req, password){
		/*gets user password*/
		return	User.getPassword(req)
			.then(existenPassword => {
				/*if user password same as provided in form then changes it to new*/
				if (password.old === existenPassword){
					let sql = `update users set password=${password.new} where id=${req.session.user}`;

					return new Promise((resolve, reject) => {
						pool.query(sql, (err, result) => {
							if (err){
								reject(err);
							} else{
								resolve(true);
							}
						});
					})
						.catch(err => console.log(err));
				/*if passwords does not match then returns false*/
				} else {
					return false;
				}
			});
	}

	static isCurrent(id, user){
		return new Promise((resolve, reject) => {
			let sql = `select 1 from users where id=${id} and email='${user.email}' and password=${user.password}`;
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else{
					if (result.length > 0){
						resolve(true);
					} else resolve(false);
				}
			});
		})
			.catch(err => console.log(err));
	}

	static delete(id){
		return new Promise((resolve, reject) => {
			let sql = `delete from users where id=${id}`;
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else{
					if (result.affectedRows > 0){
						resolve(true);
					} else resolve(false);
				}
			});
		})
			.catch(err => console.log(err));
	}

	static updateData(userId, data){
		console.log(data);
		return new Promise((resolve, reject) => {
			let sql = `update users set firstName='${data.firstName}', lastName='${data.lastName}', email='${data.email}', login='${data.login}', phone='${data.phone}' where id=${userId}`;
			pool.query(sql, (err, result) => {
				if (err){
					reject(err);
				} else{
					if (result.affectedRows > 0){
						resolve(true);
					} else resolve(false);
				}
			});
		});
	}
}

/**
  * Export
**/

module.exports = User;