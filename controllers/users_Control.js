const User = require("../models/User");

//=================================================================================================

const registerForm = (req, res) => {
	res.render("users/register");
};

const loginForm = (req, res) => {
	res.render("users/login");
};

const logOut = (req, res) => {
	req.logout();
	req.flash("success", "You have logged out!");
	res.redirect("/campgrounds");
};

const logIn = (req, res) => {
	req.flash("success", "Welcome back!");
	let returnTo = "/campgrounds";
	if (req.session.origin) {
		returnTo = req.session.origin;
		delete req.session.origin;
	}
	res.redirect(returnTo);
};

const register = async (req, res) => {
	try {
		const { email, username, password } = req.body.newUser;
		let user = new User({ email, username });
		user = await User.register(user, password);
		req.login(user, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome to YelpCamp!");
			return res.redirect("/campgrounds");
		});
	} catch (err) {
		req.flash("error", err.message);
		return res.redirect("/register");
	}
};

//=================================================================================================

module.exports = { registerForm, loginForm, logOut, logIn, register };
