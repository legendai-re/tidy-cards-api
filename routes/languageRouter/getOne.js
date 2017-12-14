module.exports = function getOne (req, res) {

    let fs = require('fs');

    let sess = req.session;
    let langId = (req.params.language_id || 'en');

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
