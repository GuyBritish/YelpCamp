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

router.post(
	"/login",
	passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
	(req, res) => {
		req.flash("success", "Welcome back!");
		res.redirect("/campgrounds");
	}
);

router.post(
	"/register",
	catchAsync(async (req, res) => {
		try {
			const { email, username, password } = req.body.newUser;
			let user = new User({ email, username });
			user = await User.register(user, password);
		} catch (err) {
			req.flash("error", err.message);
			res.redirect("/register");
		}

		req.flash("success", "Welcome to YelpCamp!");
		res.redirect("/campgrounds");
	})
);

//=================================================================================================

module.exports = router;
