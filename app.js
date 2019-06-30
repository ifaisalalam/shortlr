const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const stackdriver = require('./utils/stackdriver');

const app = express();

const routes = {
  indexRouter: require('./routes/index')
};

const {FirestoreStore} = require('@google-cloud/connect-firestore');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.GAE_SERVICE) {
  app.set('trust proxy', true);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new FirestoreStore({
    dataset: require('./utils/firestore')({
      kind: 'express-sessions'
    })
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '30d'
}));

app.use('/', routes.indexRouter);

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
  if (err.code !== 'EBADCSRFTOKEN') {
    res.status(403);
  } else {
    res.status(err.status || 500);
  }

  res.render('error');
});

app.use(stackdriver.errors.express);

module.exports = app;
