const pug = require('pug');
const path = require('path');
const router = require('express').Router();
const getCatalog = new (require('../lib/getCatalogItems'))(); 

var bookPagePath = path.join(__dirname + '/../views/bookPage.pug');//path to template
/*template locals options*/
var bookOptionsObject = {
	
}

// Compile the source code
const compiledBookPage = pug.compileFile(bookPagePath, bookOptionsObject);

router.get('/book/:id', function(req, res){
	getCatalog.byId(req.params.id, function(err, result){
		if (err) console.log("Database error!");

		res.render(path.join(__dirname + '/../views/bookPage.pug'), {
			title: result.title,
			author: result.author,
			publisher: result.publisher,
			image: result.thumbnailUrl,
			published: result.publishedYear,
			pages: result.pageCount + ' pages',
			price: '$' + result.price,
			description: result.description,
			isbn: result.isbn,
			inStock: result.status
		});
	});
});

module.exports = router;