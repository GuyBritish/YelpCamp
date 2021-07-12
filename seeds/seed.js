const mongoose = require("mongoose");
const Campground = require("../models/Campground");

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 10000,
});

const dbConnect = mongoose.connection;
dbConnect.on("error", console.error.bind(console, "Database connection error:"));
dbConnect.once("open", () => {
	console.log("Connected to database");
});

//=================================================================================================

const seed = require("./seedList");

async function seedDB() {
	await Campground.deleteMany({});
	let randNum, camp;
	for (let i = 0; i <= 49; ++i) {
		randNum = Math.floor(Math.random() * 1000);
		camp = new Campground({
			title: `${seed.descriptors[randNum % 18]} ${seed.places[randNum % 21]}`,
			price: "$15",
			description: `Camp #${i + 1}`,
			location: `${seed.cities[randNum].city}, ${seed.cities[randNum].state}`,
		});
		await camp.save();
	}
}

//=================================================================================================

seedDB();
