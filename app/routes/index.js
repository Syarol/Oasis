const express = require('express');
const app = require('../app')
const router = express.Router();
const getCatalog = new (require('../lib/getCatalogItems'))(); 


router.get('/book/:id', function(req, res){
	getCatalog.byId(function(err, result){
		if (err) console.log("Database error!");
		console.log(result);
		res.render('bookPage', {
			title: result.title,
			author: result.author,
			publisher: result.publisher,
			image: result.thumbnailUrl,
			published: result.publishedYear,
			pages: result.pageCount + ' pages',
			price: '$' + result.price,
			description: result.description,
			isbn: result.isbn,
		});
	}, req.params.id);
});

module.exports = router;