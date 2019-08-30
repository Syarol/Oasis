/**
  * Dependencies
**/

const {secret} = require('./config.js');
const session	  = require('express-session');
const RedisStore = require('connect-redis')(session);
const {redisClient} = require('./redis.js');

/**
  * Declaring and export session
**/

module.exports = session({
	store: new RedisStore({client: redisClient}),
	secret: secret,
	resave: false,
	secure: true,
	HttpOnly: true,
	cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
	saveUninitialized: false
});