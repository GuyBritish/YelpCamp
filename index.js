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

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const Joi = require("joi");
const { campSchema, reviewSchema } = require("./schemas");

//=================================================================================================

const mongoose = require("mongoose");
const Campground = require("./models/Campground");
const Review = require("./models/Review");

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

function validateCamp(req, res, next) {
	const { error } = campSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
}

function validateReview(req, res, next) {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
}

app.get("/", (req, res) => {
	res.render("home");
});

app.get(
	"/campgrounds",
	catchAsync(async (req, res) => {
		const camps = await Campground.find({});
		res.render("campgrounds/index", { camps });
	})
);

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/show", { camp });
	})
);

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/edit", { camp });
	})
);

app.post(
	"/campgrounds",
	validateCamp,
	catchAsync(async (req, res, next) => {
		//if (!req.body.newCamp) throw new ExpressError(400, "Invalid Campground Data");
		const { title, price, location } = req.body.newCamp;
		const camp = new Campground(req.body.newCamp);
		await camp.save();
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

app.post(
	"/campgrounds/:id/reviews",
	validateReview,
	catchAsync(async (req, res) => {
		const targetCamp = await Campground.findById(req.params.id);

		const { rating, body } = req.body.newReview;
		const review = new Review(req.body.newReview);
		targetCamp.reviews.push(review);
		await review.save();
		await targetCamp.save();
		res.redirect(`/campgrounds/${targetCamp._id}`);
	})
);

app.put(
	"/campgrounds/:id",
	validateCamp,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { name, price, location } = req.body.newCamp;
		const deletedCamp = await Campground.findByIdAndUpdate(id, req.body.newCamp);
		res.redirect(`/campgrounds/${deletedCamp._id}`);
	})
);

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

app.all("*", (req, res, next) => {
	//res.status(404).send("Error 404 Not Found");
	next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = "Something went wrong!" } = err;
	if (!err.statusCode) {
		err.statusCode = 500;
	}
	if (!err.message) {
		err.message = "Something went wrong!";
	}
	res.status(statusCode).render("error", { err });
});

//=================================================================================================

app.listen(3000, () => {
	console.log("YelpCamp is online on port 3000.");
});
