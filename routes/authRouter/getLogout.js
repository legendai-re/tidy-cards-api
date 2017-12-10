module.exports = function getLogout(req, res) {
    req.session.cookie.maxAge = 0;
	req.logout();
    req.session.destroy(function (err) {
    	req.logout();
    	res.json({'success': true, 'alert': 'User loged out'});
  	});
}
