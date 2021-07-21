const ExpressError = require("./utils/ExpressError");

const { campSchema, reviewSchema } = require("./schemas");

const Campground = require("./models/Campground");

const isAuth = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// Behaviour to return to
		req.session.origin = req.originalUrl;

		req.flash("error", "You must be signed in to use this function");
		return res.redirect("/login");
	}
	next();
};

const checkAuthorCamp = async (req, res, next) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

const validateCamp = (req, res, next) => {
	const { error } = campSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
};

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
};

//=================================================================================================

module.exports = { isAuth, checkAuthorCamp, validateCamp, validateReview };
