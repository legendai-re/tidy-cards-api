var express         = require('express');

var router = express.Router();

router.route('/:language_id')
    .get(function(req, res) {
        require('./getOne')(req, res);
    });

module.exports = router;
