module.exports = function getOne (req, res) {

    var fs = require('fs');

    var sess = req.session;
    var langId = (req.params.language_id || 'en');

    switch(langId){
        case 'en':
            return setAndsendLanguage('en');
        case 'fr':
            return setAndsendLanguage('fr');
        default:
            return setAndsendLanguage('en');
    }

    function setAndsendLanguage(langId){
        sess.language = langId;
        return res.json({data: getLanguage(langId)});
    }

    function getLanguage(langId){
        return JSON.parse(fs.readFileSync('languages/'+langId+'.json', 'utf8'));
    }

}
