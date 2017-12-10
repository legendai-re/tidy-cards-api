if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

var express      = require('express');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var sslRedirect  = require('heroku-ssl-redirect');
var path         = require('path');
var db           = require('./tools/mongoose');
var logger       = require('./tools/winston');
var controllers  = require('./controllers');

var app = express();
app.set('port', (process.env.PORT || 2016));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sslRedirect(['production']));

var sess = {
    store: new MongoStore({mongooseConnection: db.connection}),
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: true,
    cookie: {}
}

if(app.get('env') === 'production'){
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

require('./tools/morgan')(app);
require('./security')(app);
require('./routes')(app);

app.listen(app.get('port'), function() {
    logger.log('info', 'TidyCards is running on port', app.get('port'));
})

module.exports = app;
