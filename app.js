var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
//const authenticate = require('./authenticate');
const config = require('./config');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const incidentRouter = require('./routes/incidentRouter');

const mongoose = require('mongoose');

//const url = 'mongodb://localhost:27017/e-vidence';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  //to avoid deprecation warnings
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

//listens for all requests coming into server for https server
/*app.all('*', (req, res, next) => {
  if (req.secure) {
      return next();
  }else {
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
})*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
//app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/incidents', incidentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
