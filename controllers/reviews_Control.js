const Campground = require("../models/Campground");
const Review = require("../models/Review");

//=================================================================================================

const createReview = async (req, res) => {
	const targetCamp = await Campground.findById(req.params.campId);

	const { rating, body } = req.body.newReview;
	const review = new Review(req.body.newReview);
	review.author = req.user._id;
	targetCamp.reviews.push(review);
	await review.save();
	await targetCamp.save();
	req.flash("success", "Created new review!");
	res.redirect(`/campgrounds/${targetCamp._id}`);
};

const deleteReview = async (req, res) => {
	const { campId, reviewId } = req.params;
	await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } });
	const deletedReview = await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Review was deleted!");
	res.redirect(`/campgrounds/${campId}`);
};

//=================================================================================================

module.exports = { createReview, deleteReview };