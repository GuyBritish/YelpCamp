const isAuth = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// Behaviour to return to
		req.session.origin = req.originalUrl;

		req.flash("error", "You must be signed in to use this function");
		return res.redirect("/login");
	}
	next();
};

//=================================================================================================

module.exports = { isAuth };
