module.exports = function(app) {

    var express             = require('express');
    var path                = require('path');
    var userAgentParser     = require('../helpers/user-agent-parser');
    var authRouter          = require('./authRouter');
    var userRouter          = require('./userRouter');
    var collectionRouter    = require('./collectionRouter');
    var imageRouter         = require('./imageRouter');
    var itemRouter          = require('./itemRouter');
    var starRouter          = require('./starRouter');
    var resetRouter         = require('./resetRouter');
    var rolesRouter         = require('./rolesRouter');
    var languageRouter      = require('./languageRouter');
    var paymentRouter       = require('./paymentRouter');
    var devRouter           = require('./devRouter');

    app.use('/', express.static(path.resolve(__dirname, '../tidy-cards-web-app/dist')));
    app.use('/api/doc', express.static(path.resolve(__dirname, '../doc')));

    app.use('/auth', authRouter);

    app.use('/api/users', userRouter);
    app.use('/api/collections', collectionRouter);
    app.use('/api/images', imageRouter);
    app.use('/api/items', itemRouter);
    app.use('/api/stars', starRouter);
    app.use('/api/reset', resetRouter);
    app.use('/api/roles', rolesRouter);
    app.use('/api/languages', languageRouter);
    app.use('/api/payments', paymentRouter)

    app.use('/api/dev', devRouter);

    app.use('/c/:collection_id', function(req, res, next){
        if(userAgentParser.isFromABrowser(req.headers['user-agent']))
            next();
        else
            require('./_notWebosRouter/collectionRouter/getOne')(req,res);
    })

    app.get('api/doc', function(req, res) {
        res.sendFile(path.resolve(__dirname, '../doc/index.html'));
    })

    app.get('/*', function(req, res) {
        res.sendFile(path.resolve(__dirname, '../tidy-cards-web-app/dist/index.html'));
    })

}
