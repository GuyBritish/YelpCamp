const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { campSchema } = require("../schemas");

const Campground = require("../models/Campground");

//=================================================================================================

function validateCamp(req, res, next) {
	const { error } = campSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, msg);
	}
	next();
}

router.get(
	"/",
	catchAsync(async (req, res) => {
		const camps = await Campground.find({});
		res.render("campgrounds/index", { camps });
	})
);

router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id).populate("reviews");
		res.render("campgrounds/show", { camp });
	})
);

router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/edit", { camp });
	})
);

router.post(
	"/",
	validateCamp,
	catchAsync(async (req, res, next) => {
		//if (!req.body.newCamp) throw new ExpressError(400, "Invalid Campground Data");
		const { title, price, location } = req.body.newCamp;
		const camp = new Campground(req.body.newCamp);
		await camp.save();
		req.flash("success", "Successfully created a new campground!");
		res.redirect(`/campgrounds/${camp._id}`);
	})
);

router.put(
	"/:id",
	validateCamp,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { name, price, location } = req.body.newCamp;
		const deletedCamp = await Campground.findByIdAndUpdate(id, req.body.newCamp);
		req.flash("success", "Successfully updated campground!");
		res.redirect(`/campgrounds/${deletedCamp._id}`);
	})
);

router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted campground!");
		res.redirect("/campgrounds");
	})
);

//=================================================================================================

module.exports = router;
