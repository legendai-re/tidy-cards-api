module.exports = function getValidUsername (req, res) {

    let models      = require('../../models');
    let usernameValidator = require('../../helpers/user/usernameValidator');

    let rq = req.query;

    if(!rq.username){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        if(!usernameValidator.isValid(rq.username)){
            return res.json({data: {isValid: false}});
        }

        let regex = new RegExp(["^", rq.username, "$"].join(""), "i");
        let filterObj = req.user ? {username: regex,  _id: { $ne: req.user._id }} : {username: regex};

        models.User.findOne(filterObj, function(err, user){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(user) return res.json({data: {isValid: false}});
            return res.json({data: {isValid: true}});
        })
    }

};
