let express         = require('express');
let ExpressBrute    = require('express-brute');
let isGranted       = require('../../security/isGranted');
let router          = express.Router();
let store           = new ExpressBrute.MemoryStore();
let bruteforce      = new ExpressBrute(store);

router.route('/initiate')
    .put(function(req,res){
        require('./putInitiate')(req, res);
    });

router.route('/complete')
    .put(bruteforce.prevent, function(req,res){
        require('./putComplete')(req, res);
    });

module.exports = router;
