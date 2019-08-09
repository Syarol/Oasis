/**
 * Reads environment variables from .env
**/

//require('dotenv').config(); //if commented then - replaced with '-r dotenv/config' preloading (allows to work without .env file)

/**
 * Export all of gathered environment variables
**/

module.exports = {
	port: process.env.PORT,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	db: process.env.DB_NAME
};