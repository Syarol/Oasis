/**
	* Dependencies
**/

const pug = require('pug');
const path = require('path');
const router = require('express').Router();
const Catalog = require('../lib/Catalog'); 
const User = require('./../lib/User');
const pool = require('../lib/db');

/**
	* Variables
**/

const indexPagePath = path.join(__dirname + './../views/index.pug');//
const searchPagePath = path.join(__dirname + './../views/search.pug');//
const shopPagePath = path.join(__dirname + './../views/shop.pug');//
const profilePath = path.join(__dirname + './../views/profile.pug');//
const bookPagePath = path.join(__dirname + '/../views/bookPage.pug');//path to template

/**
	* Routes
**/

/*router for static pages*/
router.get('/', function(req, res){
	res.render(indexPagePath, {
		user: req.session.user,
		pageTitle: 'Oasis'
	});	 
});

router.get('/blog', function(req, res){
	res.sendFile('blog.html', {
		root: path.join(__dirname + '/../public/html')
	});
});

router.get('/shop', function(req, res){
	console.log(req.session.user);
	res.render(shopPagePath, {
		user: req.session.user,
		pageTitle: 'Oasis online-store'
	});	
});

router.get('/search', function(req, res){
	res.render(searchPagePath, {
		user: req.session.user,
		pageTitle: 'Oasis online-store'
	});	
});

router.get('/login', function(req, res){
	/*if user already authorized then redirects to homepage*/
	if (req.session.user){
		res.redirect('/');
	} else
		res.sendFile('login.html', {
			root: path.join(__dirname + '/../public/html')
		});
});

router.get('/register', function(req, res){
	/*if user already authorized then redirects to homepage*/
	if (req.session.user){
		res.redirect('/');
	} else
		res.sendFile('register.html', {
			root: path.join(__dirname + '/../public/html')
		});
});

/*router for dynamic pages*/
router.get('/book/:id', function(req, res){
	Catalog.getByColumn({id: req.params.id})
		.then(result => {
			let query = `SELECT c.id, c.title, c.thumbnailUrl, group_concat(a.author) as author 
			FROM catalog c
			INNER JOIN BookAuthors ba
				ON c.id = ba.bookId
			INNER JOIN Authors a
				ON ba.authorId= a.id 
			group by c.title
 			ORDER BY RAND() LIMIT 4`;

			pool.query(query, function (err, randomBooks) {
				if (err) throw err;
 
				result.author = result.author.split(','); //splits string to array in case that book has more than one author 

				res.render(bookPagePath, {
					user: req.session.user,
					pageTitle: 'Oasis | ' + result.title,
					book: result,
					ymalBooks: randomBooks
				});	 
			});
	});
});

router.get('/profile', function(req, res){
	if (req.session.user){
		User.getAllData(req.session.user.id)
			.then(user => {
				console.log(user[0]);
				res.render(profilePath, {
					user: user[0],
					pageTitle: 'Oasis | My Cabinet'
				});
			});
		} else {
			res.redirect('/login');
		}
});

router.get('/logout', function(req, res){
  User.logOut(req);
  res.redirect('/login');
});

/*Error pages*/
router.get('/404', function(req, res){
	res.render(path.join(__dirname + '/../views/errorPage.pug'), {
			code: 404,
			description: 'Sorry, but page is not found 😥'
		});
});

router.get('/500', function(req, res){
	res.render(path.join(__dirname + '/../views/errorPage.pug'), {
		code: 500,
		description: 'Something broken!😥'
	});
});

/**
	* Export
**/

module.exports = router;
