const express = require("express");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//=================================================================================================

const mongoose = require("mongoose");
const Campground = require("./models/Campground");

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

app.get("/", (req, res) => {
	res.render("home");
});

//=================================================================================================

app.listen(3000, () => {
	console.log("YelpCamp is online on port 3000.");
});
