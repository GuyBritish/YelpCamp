const mongoose = require("mongoose");
const Review = require("./Review");

const CampgroundSchema = new mongoose.Schema({
	title: String,
	images: [
		{
			url: String,
			filename: String,
		},
	],
	price: Number,
	description: String,
	location: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
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
