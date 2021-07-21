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
	let randLocation, randName1, randName2, camp;
	for (let i = 0; i <= 49; ++i) {
		randLocation = Math.floor(Math.random() * seed.cities.length);
		randName1 = Math.floor(Math.random() * seed.descriptors.length);
		randName2 = Math.floor(Math.random() * seed.places.length);
		camp = new Campground({
			title: `${seed.descriptors[randName1]} ${seed.places[randName2]}`,
			image: "https://source.unsplash.com/collection/220381",
			price: Math.floor(Math.random() * 20) + 15,
			description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste id possimus ut animi, illo, rem deserunt nihil sequi laudantium tempore nulla aut doloribus omnis debitis tenetur! Eaque eum repudiandae iusto!`,
			location: `${seed.cities[randLocation].city}, ${seed.cities[randLocation].state}`,
			author: "60f7dffca3397d5b049997c2",
		});
		await camp.save();
	}
}

//=================================================================================================

seedDB();
