module.exports = function getOne (req, res) {

    let models      = require('../../models');
    let mongodbid   = require('../../helpers/mongodbid');
    let lifeStates  = require('../../models/lifeStates.json');

    let rq = req.query;
    let q = null;

    let noCaseUsernameRegex = new RegExp(["^", req.params.user_id, "$"].join(""), "i");

    if(mongodbid.isMongoId(req.params.user_id))
        q = models.User.findById(req.params.user_id);
    else if(isEmail(req.params.user_id))
        q = models.User.findOne({email: noCaseUsernameRegex});
    else
        q = models.User.findOne({username: noCaseUsernameRegex});

    if(rq.populate){
        q.populate(rq.populate);
    }

    if(rq.sort_field && rq.sort_dir && (parseInt(rq.sort_dir)==1 || parseInt(rq.sort_dir)==-1)){
        let sortObj = {};
        sortObj[rq.sort_field] = rq.sort_dir;
        q.sort(sortObj);
    }

	q.exec(function(err, user){
        if(err) {console.log(err); res.sendStatus(500); return;}
        if(!user || user.lifeState != lifeStates.ACTIVE.id) { res.sendStatus(404); return;} 
        res.json({data: user});
    })

    function isEmail(email){
        return new RegExp('.+@.+\\..+').test(email);;
    }
}
