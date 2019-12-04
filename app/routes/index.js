/**
	* Dependencies
**/

const pug = require('pug');
const path = require('path');
const router = require('express').Router();
const Catalog = require('../lib/Catalog');
const Address = require('../lib/Address'); 
const User = require('./../lib/User');
const pool = require('../lib/db');
const Order = require('../lib/Order');

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
			.then(async user => {
				let countries = await Address.getAllCountries();
				console.log(user[0]);
				
				let dat = await Order.getAll(req.session.user.id)
    				.then(async result => {
    					result = Array.from(result);

    					let booksIdsArr = [];
    					for(let item of result){
    						if (booksIdsArr.includes(item.bookId)){
    							continue;
    						} else {
    							booksIdsArr.push(item.bookId);
    						}
    					}


    					let books = [];
    					for (let book of booksIdsArr){
    						let booksd = await Catalog.getBook(book);
    						books.push({
    							id: book,
    							price: booksd.price,
    							title: booksd.title,
    							authors: booksd.authors
    						}); 
    					}
    					console.log(books);

    					let ordersIdsArr = [];
    					for(let item of result){
    						if (ordersIdsArr.includes(item.id)){
    							continue;
    						} else {
    							ordersIdsArr.push({
    								id: item.id,
    								time: item.time,
    								payment: item.payment,
    								items: []
    							});
    						}
    					}
    				//	console.log(ordersIdsArr);;


    					for(let item of ordersIdsArr){
    						console.log(item);
    						let orderItems = result.filter(el => el.id === item.id);

    						if (ordersIdsArr.items && item.items.includes(orderItems[0].id === item.id)){
    							console.log('de');
    						} else {

    							item.items = orderItems;
    							console.log(item.items);
    						}
    					} 

    					for(let item of ordersIdsArr){
    						for(let i of item.items){
    							delete i.id;
    							delete i.userId;
    							delete i.time;
    							delete i.payment;

    							let booksss = books.find(el => el.id === i.bookId);

    							i.price = booksss.price;
    							i.title = booksss.title;
    							i.authors = booksss.authors;
    						}
    					console.log(item);
    					}

//console.log(ordersIdsArr);
ordersIdsArr = ordersIdsArr.filter((thing, index, self) =>
  index === self.findIndex((t) => (
   t.id === thing.id
  ))
)

    					return ordersIdsArr;




    				});


    				for (let item of dat){
    					let total = 0;
    					for (let book of item.items){
    						total += book.price * book.count;
    						console.log(total);
    					}
    					item.total = total;
    				}

				res.render(profilePath, {
					user: user[0],
					countries: countries,
					orders: dat,
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
