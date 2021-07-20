const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const User = require("../models/User");

//=================================================================================================

router.get("/register", (req, res) => {
	res.render("users/register");
});

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
