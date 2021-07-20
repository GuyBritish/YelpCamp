const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const User = require("../models/User");

//=================================================================================================

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have logged out!");
	res.redirect("/campgrounds");
});

router.post(
	"/login",
	passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
	(req, res) => {
		req.flash("success", "Welcome back!");
		let returnTo = "/campgrounds";
		if (req.session.origin) {
			returnTo = req.session.origin;
			delete req.session.origin;
		}
		res.redirect(returnTo);
	}
);

router.post(
	"/register",
	catchAsync(async (req, res) => {
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
	})
);

//=================================================================================================

module.exports = router;
