/**
  * Dependencies
**/

const pool = require('./db');

/**
  * Class
**/

class Address{
	getAllCountries(){
		return new Promise(function(resolve, reject){
			pool.query('select * from countries', function(err, result){
				if (err){
					reject(err);
				} else{
					resolve(result);
				}
			});
		});
	}
}

/**
  * Export
**/

module.exports = new Address();