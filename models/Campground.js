const mongoose = require("mongoose");
const Review = require("./Review");

const CampgroundSchema = new mongoose.Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

const Campground = mongoose.model("Campground", CampgroundSchema);

//=================================================================================================

module.exports = Campground;
