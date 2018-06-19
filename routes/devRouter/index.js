let express         = require('express');
let isGranted       = require('../../security/isGranted');

let router = express.Router();

router.route('/welcome')
    .get(isGranted('ROLE_ADMIN'), function(req, res) {
        res.json({message: "Welcome !"})
    });

router.route('/logs/:filename')
    .get(isGranted('ROLE_ADMIN'), function(req, res) {
        require('./getLogs')(req, res);
    });

router.route('/setItemsAuthor')
    .get(isGranted('ROLE_ADMIN'), function(req, res) {
        require('./setItemsAuthor')(req, res);
    });

module.exports = router;
