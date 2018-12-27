const pug = require('pug');
const path = require('path');
const router = require('express').Router();
const getCatalog = new (require('../lib/getCatalogItems'))(); 

var bookPagePath = path.join(__dirname + '/../views/bookPage.pug');//path to template
var bookOptionsObject = {}; //template locals option

// Compile the source code
const compiledBookPage = pug.compileFile(bookPagePath, bookOptionsObject);

/*router for static pages*/
router.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/../public/html/index.html'));
});

router.get('/blog', function(req, res){
  res.sendFile(path.join(__dirname + '/../public/html/blog.html'));
});

router.get('/shop', function(req, res){
  res.sendFile(path.join(__dirname + '/../public/html/shop.html'));
});

router.get('/search', function(req, res){
  	res.sendFile(path.join(__dirname + '/../public/html/search.html'));
});

/*router for dynamic pages*/
router.get('/book/:id', function(req, res){
	getCatalog.byId(req.params.id, function(err, result){
		if (err) console.log(err);

		res.render(path.join(__dirname + '/../views/bookPage.pug'), {
			book: result
		});
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


module.exports = router;
