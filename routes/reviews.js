const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schemas");

const Campground = require("../models/Campground");
const Review = require("../models/Review");

//=================================================================================================

function validateReview(req, res, next) {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
}

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const targetCamp = await Campground.findById(req.params.campId);

		const { rating, body } = req.body.newReview;
		const review = new Review(req.body.newReview);
		targetCamp.reviews.push(review);
		await review.save();
		await targetCamp.save();
		res.redirect(`/campgrounds/${targetCamp._id}`);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { campId, reviewId } = req.params;
		await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
		const deletedReview = await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${campId}`);
	})
);

//=================================================================================================

module.exports = router;
