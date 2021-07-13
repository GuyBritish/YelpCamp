const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
});

const Campground = mongoose.model("Campground", CampgroundSchema);

//=================================================================================================

module.exports = Campground;
