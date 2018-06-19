if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let express = require('express')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let sslRedirect = require('heroku-ssl-redirect')
let path = require('path')
let db = require('./tools/mongoose')
let logger = require('./tools/winston')
let controllers = require('./controllers')

let app = express()

app.set('port', (process.env.PORT || 2016))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.w/views'))

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(sslRedirect(['production']))

let sess = {
  store: new MongoStore({mongooseConnection: db.connection}),
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

require('./tools/morgan')(app)
require('./security')(app)
require('./routes')(app)

app.listen(app.get('port'), function () {
  logger.log('info', 'TidyCards is running on port', app.get('port'))
})

module.exports = app
