module.exports = function putDeactivate (req, res) {
  let inviteEmail = require('../../helpers/email/invite-user')

  inviteEmail.send(req.user, req.params.email, function(err){
    if(err) { console.log(err); return res.status(500).send() }
    res.json({success: true})
  })
}
