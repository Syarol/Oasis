/**
 * Reads environment variables from .env
**/

//require('dotenv').config(); //if commented then - replaced with '-r dotenv/config' preloading (allows to work without .env file)

/**
 * Export all of gathered environment variables
**/

module.exports = {
	port: process.env.PORT,
	dbHost: process.env.DB_HOST,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	db: process.env.DB_NAME,
	redisUrl: process.env.REDIS_URL
};