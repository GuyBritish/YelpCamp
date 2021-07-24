const mongoose = require("mongoose");
const Review = require("./Review");

const ImageSchema = new mongoose.Schema({
	url: String,
	filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new mongoose.Schema({
	title: String,
	images: [ImageSchema],
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

	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
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
