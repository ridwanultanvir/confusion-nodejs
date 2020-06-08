var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/confusion';
const connection = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connection.then((db) => {
  console.log('connected to database');
}, (err) => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); // to log activities in the console
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('tt142857')); //supplied secret key to sign cookies from the sorver in the parameter

function auth(req, res, next) {
  console.log(req.signedCookies);
  console.log(req.headers);

  if (!req.signedCookies.user) {

    let authHeader = req.headers.authorization;

    if (!authHeader) {
      let err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    else {
      let authDecode = new Buffer.from(authHeader.split(' ')[1], 'base64').toString();

      console.log(authDecode);

      let auth = authDecode.split(':');

      let username = auth[0];
      let password = auth[1];

      if (username === 'admin' && password === 'password') {
        res.cookie('user', 'admin', { signed: true }); //setting a signed cookie user: admin
        next();
        return;
      }
      else {
        let err = new Error('wrong username or password');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
      }
    }
  }
  else {
    if (req.signedCookies.user === 'admin') {
      next();
      return;
    }
    else {
      let err = new Error('You are not authenticated');
      err.status = 401;
      next(err);
      return;
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);


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
