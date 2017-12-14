let express         = require('express');

let router = express.Router();

/**
 * @api {get} /api/languages/:language_id Get a language
 * @apiPermission none
 * @apiName GetOneLanguage
 * @apiGroup Language
 * @apiSuccess {Object} - All the texts in the selected language.
 */
router.route('/:language_id')
    .get(function(req, res) {
        require('./getOne')(req, res);
    });

module.exports = router;
