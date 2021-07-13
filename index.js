const express = require("express");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);

//=================================================================================================

const mongoose = require("mongoose");
const Campground = require("./models/Campground");

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 10000,
	useFindAndModify: false,
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

app.get("/campgrounds", async (req, res) => {
	const camps = await Campground.find({});
	res.render("campgrounds/index", { camps });
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("campgrounds/show", { camp });
});

app.post("/campgrounds", async (req, res) => {
	const { name, price, location } = req.body.newCamp;
	const camp = new Campground(req.body.newCamp);
	await camp.save();
	res.redirect(`/campgrounds/${camp._id}`);
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("campgrounds/edit", { camp });
});

app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const { name, price, location } = req.body.newCamp;
	const deletedCamp = await Campground.findByIdAndUpdate(id, req.body.newCamp);
	res.redirect(`/campgrounds/${deletedCamp._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

//=================================================================================================

app.listen(3000, () => {
	console.log("YelpCamp is online on port 3000.");
});
