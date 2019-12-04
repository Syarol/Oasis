'use strict';

const {port} = require('./lib/config.js');
const express = require('express');
const path = require('path');
const cart = new (require('./lib/cart'))();
const Message = require('./lib/Message');
const User = require('./lib/User');
const bodyParser  = require('body-parser');
const Catalog = require('./lib/Catalog');
const router = require('./routes/index');
const app = express();
const session = require('./lib/session.js');
const Order = require('./lib/Order');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname));
app.use(session);
app.use(router);
app.use(bodyParser.json());

app.post('/getSearchResults', function(req, res){
  console.log(req.body);
	Catalog.search(req.body, res);
});

app.post('/getCart', function(req, res) {
  res.send(cart.getItems(req));
});

app.post('/setCart', function(req, res) {
  cart.setItems(req, res);
  res.send();
});

app.post('/sendMessage', function(req, res) {
  Message.send(req.body)
    .then(() => res.send());
});

app.post('/newOrder', function(req, res){
  Order.new(req.session.user.id, req.body)
    .then(result => res.send(JSON.stringify({isOK:result})));
});

app.post('/getOrders', function(req, res){
 // Order.getAll(req.session.user.id)
   // .then(result => res.send(JSON.stringify(result)));
  Order.getAll(req.session.user.id)
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
            //  console.log(ordersIdsArr);;


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

            //  ordersIdsArr.reduce((un, it) => un.includes(it) ? un : [...un, it]);

              res.send(JSON.stringify(ordersIdsArr));




            });
});

app.get('/getByColumn', function(req, res) {
	Catalog.getByColumn({[req.query.column]: req.query.value})
    .then(result => res.send(JSON.stringify(result)));
});

app.get('/getCategories', function(req, res){
  Catalog.getAllCategories()
    .then(data => res.send(data));
});

app.get('/getAuthors', function(req, res){
  Catalog.getAllAuthors()
    .then(data => res.send(data));
});

app.get('/getPublishers', function(req, res){
	Catalog.getAllPublishers()
    .then(data => res.send(data));
});

app.get('/getLowHighPrice', function(req, res){
  Catalog.getlowHighPrice(res);
});

/* User profile interaction */

app.post('/isAuth', (req, res) => {
  console.log(JSON.stringify({isAuth: isUserAuthorized(req)}));
  res.send(JSON.stringify({isAuth: isUserAuthorized(req)}));
});

app.post('/regNewUser', function(req, res){
  User.isUniqueUsed('email', req.body.email)
    .then(() => User.register(req.body));
});

app.post('/logInUser', function(req, res){
  User.logIn(req.headers.authorization)
    .then(user => {
      if (user) {
        req.session.user = user;
        res.send(JSON.stringify({isAuth: true}));
      } else res.send(JSON.stringify({isAuth: false}));
    });
});

app.post('/isThisUser', function(req, res){
  User.isCurrent(req.session.user.id, req.body)
    .then(isOK => {
      res.send(JSON.stringify({isOK: isOK}));
    });
});

app.get('/deleteAccount', function(req, res){
  User.delete(req.session.user.id)
    .then(isOK => {
      res.send(JSON.stringify({isOK: isOK}));
    });
});

app.post('/checkAndDelete', function(req, res){
  User.isCurrent(req.session.user, req.body)
    .then(isOK => {
      if (isOK) {
        User.delete(req.session.user.id)
          .then(isDeleted => {
            if (isDeleted){
              req.session.destroy(); //clears session and opens login/register pages
              res.send(JSON.stringify({
                error: false,
                message: 'Account successfully deleted!'
              }));
            } else{
              res.send(JSON.stringofy({
                error: true,
                message: 'Something went wrong. Try again later!'
              }));
            }
          })
      } else res.send(JSON.stringify({
        error: true,
        message: 'Password and/or email not matches!'
      }));
    });
});

app.post('/isUniqueUsed', function(req, res){
  let key = Object.keys(req.body)[0]; //have to be passed onlu one key-value pair
  User.isUniqueUsed(key, req.body[key], req.session.user)
    .then(data => res.send(JSON.stringify({isUsed: data})));
});

app.get('/getUserData', function(req, res){
  User.getAllData(req.session.user.id)
    .then(data => res.send(JSON.stringify(data)));
});

app.post('/changePassword', function(req, res){
  User.changePassword(req, req.body)
    .then(isOK => res.send(JSON.stringify({status: isOK})));
});

app.post('/updateUserData', function(req, res){
  User.updateData(req.session.user.id, req.body)
    .then(isOK => res.send(JSON.stringify({status: isOK})));
});

app.post('/updateAddress', function(req, res){
  User.updateAddress(req.session.user.id, req.body)
    .then(isOK => res.send(JSON.stringify({status: isOK})));
});

/**
 * Errors handling
**/

app.use(function(req, res, next){
  res.status(404);
  res.render('errorPage.pug', {
      root: path.join(__dirname + '/../app/views'),
      code: 404,
      description: 'Sorry, but page is not found 😥'
    });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('errorPage.pug', {
    root: path.join(__dirname + '/../app/views'),
    code: 500,
    description: 'Something broken!😥'
  });
});

/**
 * Binds and listens for connections on port
**/

app.listen(process.env.PORT || port);

//returns boolean value of user authorization
function isUserAuthorized(req){
  if (req.session.user) 
    return true;
  else
    return false;  
}