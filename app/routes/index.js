const pug = require('pug');
const path = require('path');
const router = require('express').Router();
const getCatalog = new (require('../lib/getCatalogItems'))(); 

var bookPagePath = path.join(__dirname + '/../views/bookPage.pug');//path to template
var bookOptionsObject = {}; //template locals option

// Compile the source code
const compiledBookPage = pug.compileFile(bookPagePath, bookOptionsObject);

router.get('/book/:id', function(req, res){
	getCatalog.byId(req.params.id, function(err, result){
		if (err) console.log(err);

		res.render(path.join(__dirname + '/../views/bookPage.pug'), {
			book: result
		});
	});
});

module.exports = router;