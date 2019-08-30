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

const profilePath = path.join(__dirname + './../views/profile.pug'); //
const bookPagePath = path.join(__dirname + '/../views/bookPage.pug');//path to template
var bookOptionsObject = {}; //template locals option

// Compile the source code
//const compiledBookPage = pug.compileFile(bookPagePath, bookOptionsObject);

/**
  * Routes
**/

/*router for static pages*/
router.get('/', function(req, res){
    res.sendFile('index.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

router.get('/blog', function(req, res){
  res.sendFile('blog.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

router.get('/shop', function(req, res){
  res.sendFile('shop.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

router.get('/search', function(req, res){
  res.sendFile('search.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

router.get('/login', function(req, res){
  res.sendFile('login.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

router.get('/register', function(req, res){
  res.sendFile('register.html', {
    root: path.join(__dirname + '/../public/html')
  });
});

/*router for dynamic pages*/
router.get('/book/:id', function(req, res){
	Catalog.bySimpleColumn({id: req.params.id}, res, function(err, result){
		if (err) throw err;

    let query = 'SELECT * FROM Catalog ORDER BY RAND() LIMIT ' + 4;

    pool.query(query, function (err, random) {
      if (err) callback(err);

      res.render(bookPagePath, {
        book: result,
        ymalBooks: random
      });   
    });

	});
});

router.get('/profile', function(req, res){
	User.getAllData(req.session.user)
		.then(user => {
			res.render(profilePath, {user: user});
		});
});

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
