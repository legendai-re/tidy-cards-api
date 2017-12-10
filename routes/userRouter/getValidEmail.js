module.exports = function getValidEmail (req, res) {

    var models      = require('../../models');

    var rq = req.query;

    if(!rq.email){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        if(!new RegExp(".+@.+\\..+").test(rq.email.toLowerCase()))
            return res.json({data: {isValid: false}});


        var filterObj = req.user ? {email: rq.email.toLowerCase().replace(/\s/g, ''),  _id: { $ne: req.user._id }} : {email: rq.email.toLowerCase().replace(/\s/g, '')};

        models.User.findOne(filterObj, function(err, user){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(user) return res.json({data: {isValid: false}});
            return res.json({data: {isValid: true}});
        })
    }

}
