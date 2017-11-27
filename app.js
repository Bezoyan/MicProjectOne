const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fiash = require('connect-flash');
const session = require('express-session')

const Article = require('./models/article');
const users = require('./routes/users');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});

//check for DB errors
db.on('error', function(err) {
  console.log(err);
});

//init app
const app = express();

//Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
  let  namespace = param.split('.')
  , root = namespace.shift()
  , formParam = root;

  while (namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg   : msg,
    value :value
  };
 }
}));

//Route files
app.use('/users', users);
//home route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

//Get Single Article
app.get('/article/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article:article
    });
  });
});

//add route
app.get('/articles/add', function(req, res) {
  res.render('add_article',{
    title:'Add Article'
  });
});

//Add submit POST
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

//Server start
app.listen(3005, function () {
console.log ('server started on port 3005*')
});
