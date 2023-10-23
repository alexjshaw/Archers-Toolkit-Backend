var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet')
require('./database/mongo.js')
var { jwtCheck } = require('./auth.js')

var userRouter = require( './routes/user', jwtCheck)
var scoreRouter = require('./routes/score', jwtCheck)
var archerProfileRouter = require('./routes/archerProfile', jwtCheck)
var equipmentRouter = require('./routes/equipment', jwtCheck)
var sightmarkRouter = require('./routes/sightmark', jwtCheck)
var roundTypeRouter = require('./routes/roundType', jwtCheck)

var app = express();
app.use(express.json())
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'", 'https://dev-wn87thdr6glngf33.uk.auth0.com'],
        'script-src': ["'self'", (req, res) => `'nonce-${req.cspNonce}'`],
        'connect-src': ["'self'", 'ws://localhost:24678', 'http://localhost:24678', 'https://dev-wn87thdr6glngf33.uk.auth0.com'],
        'img-src': ["'self'", 'data:', 'https://s.gravatar.com', 'https://*.wp.com']
      }
    }
  })
)

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use('/user', userRouter)
app.use('/score', jwtCheck, scoreRouter)
app.use('/archerProfile', jwtCheck, archerProfileRouter)
app.use('/equipment', jwtCheck, equipmentRouter)
app.use('/sightmark', jwtCheck, sightmarkRouter)
app.use('/roundtype', jwtCheck, roundTypeRouter)

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
