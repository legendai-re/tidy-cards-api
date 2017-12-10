var express         = require('express');
var ExpressBrute    = require('express-brute');
var isGranted       = require('../../security/isGranted');
var router          = express.Router();
var store           = new ExpressBrute.MemoryStore();
var bruteforce      = new ExpressBrute(store);

router.route('/initiate')
    .put(function(req,res){
        require('./putInitiate')(req, res);
    });

router.route('/complete')
    .put(bruteforce.prevent, function(req,res){
        require('./putComplete')(req, res);
    });

module.exports = router;
