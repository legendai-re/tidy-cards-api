var express         = require('express');
var isGranted       = require('../../security/isGranted');

var router = express.Router();

router.route('/welcome')
    .get(isGranted('ROLE_ADMIN'), function(req, res) {
        res.json({message: "Welcome !"})
    });

router.route('/logs/:filename')
    .get(isGranted('ROLE_ADMIN'), function(req, res) {
        require('./getLogs')(req, res);
    });

module.exports = router;
