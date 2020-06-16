var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');


const url = config.mongoUrl;
const connection = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connection.then((db) => {
  console.log('connected to database');
}, (err) => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var uploadRouter = require('./routes/uploadRouter');
var favouritesRouter = require('./routes/favouriteRouter');

//console.log('inside app.js 1 ')

var app = express();

//secure traffics only

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); // to log activities in the console
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//console.log('inside app.js 2 ')

// app.use(session({
//   name: 'session-id',
//   secret: 'tt142857',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));


app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//console.log('inside app.js 3 ')

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     return next(err);
//   }
//   else {
//     next();
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favourite', favouritesRouter);

//console.log('inside app.js 4 ')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//console.log('inside app.js 5')