module.exports = function (app) {
  let express = require('express')
  let path = require('path')
  let userAgentParser = require('../helpers/user-agent-parser')
  let authRouter = require('./authRouter')
  let userRouter = require('./userRouter')
  let collectionRouter = require('./collectionRouter')
  let imageRouter = require('./imageRouter')
  let itemRouter = require('./itemRouter')
  let starRouter = require('./starRouter')
  let resetRouter = require('./resetRouter')
  let rolesRouter = require('./rolesRouter')
  let languageRouter = require('./languageRouter')
  let paymentRouter = require('./paymentRouter')
  let devRouter = require('./devRouter')

  app.use('/', express.static(path.resolve(__dirname, '../tidy-cards-web-app/dist')))
  app.use('/api/doc', express.static(path.resolve(__dirname, '../doc')))

  app.use('/auth', authRouter)

  app.use('/api/users', userRouter)
  app.use('/api/collections', collectionRouter)
  app.use('/api/images', imageRouter)
  app.use('/api/items', itemRouter)
  app.use('/api/stars', starRouter)
  app.use('/api/reset', resetRouter)
  app.use('/api/roles', rolesRouter)
  app.use('/api/languages', languageRouter)
  app.use('/api/payments', paymentRouter)

  app.use('/api/dev', devRouter)

  app.use('/c/:collection_id', function (req, res, next) {
    if (userAgentParser.isFromABrowser(req.headers['user-agent'])) { next() } else { require('./_notWebosRouter/collectionRouter/getOne')(req, res) }
  })

  app.get('api/doc', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../doc/index.html'))
  })

  app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../tidy-cards-web-app/dist/index.html'))
  })
}
