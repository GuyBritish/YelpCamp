const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

//=================================================================================================

const mongoose = require("mongoose");

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

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

app.get("/", (req, res) => {
	res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:campId/reviews", reviews);

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
