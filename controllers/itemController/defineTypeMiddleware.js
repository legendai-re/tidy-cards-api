let defineType = require('./defineType');

module.exports = function defineItemTypeMidleware() {
    return function(req, res, next) {

        result = defineType(req.body.url);

        if(result.error){
            res.status(400).send({ error: 'some required parameters was not provided'});
            res.end();
        }else{
            req.itemType = result.itemType;
            next();
        }

    }
};
