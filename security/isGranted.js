module.exports = function isGranted(role) {
	return function(req, res, next) {
		if (req.isAuthenticated() && req.user.isGranted(role)) return next();
		res.sendStatus(401);
	}
}

