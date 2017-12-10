var express         = require('express');
var isGranted       = require('../../security/isGranted');

var router = express.Router();

router.route('/')
    .post(isGranted('ROLE_USER'), function(req, res) {
        require('./post')(req, res);
    });

router.route('/:star_id')
    .delete(isGranted('ROLE_USER'), function(req, res) {
        require('./delete')(req, res);
    });

module.exports = router;
