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

	static isEmailUsed(email){
		let sql = `SELECT 1 FROM Users WHERE email='${email}'`;
		return new Promise(function(resolve, reject){
			pool.query(sql, function (err, result) {
			    if (err){
			    	reject(err)
			    } else{
						if (result[0]) {
			    		resolve(true)
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

			let sql = `SELECT 1 FROM Users WHERE (email='${email}' and password='${password}')`;

			pool.query(sql, function (err, result) {
			    if (err){
			    	reject(err)
			    } else{
						if (result[0]) {
			    		resolve(true)
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
}

/**
  * Export
**/

module.exports = User;