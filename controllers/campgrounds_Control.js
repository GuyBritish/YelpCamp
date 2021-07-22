const Campground = require("../models/Campground");

//=================================================================================================

const indexPage = async (req, res) => {
	const camps = await Campground.find({});
	res.render("campgrounds/index", { camps });
};

const newCampForm = (req, res) => {
	res.render("campgrounds/new");
};

const showCamp = async (req, res) => {
	const { id } = req.params;

	const camp = await Campground.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");

	if (!camp) {
		req.flash("error", "Couldn't find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { camp });
};

const editCampForm = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp) {
		req.flash("error", "Couldn't find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { camp });
};

const createCamp = async (req, res, next) => {
	//if (!req.body.newCamp) throw new ExpressError(400, "Invalid Campground Data");
	const { title, price, location } = req.body.newCamp;
	const camp = new Campground(req.body.newCamp);
	camp.author = req.user._id;
	await camp.save();
	req.flash("success", "Successfully created a new campground!");
	res.redirect(`/campgrounds/${camp._id}`);
};

const editCamp = async (req, res) => {
	const { id } = req.params;
	const { name, price, location } = req.body.newCamp;
	const targetCamp = await Campground.findByIdAndUpdate(id, req.body.newCamp);
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${targetCamp._id}`);
};

const deleteCamp = async (req, res) => {
	const { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground!");
	res.redirect("/campgrounds");
};

//=================================================================================================

module.exports = {
	indexPage,
	newCampForm,
	showCamp,
	editCampForm,
	createCamp,
	editCamp,
	deleteCamp,
};