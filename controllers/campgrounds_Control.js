const mbxToken = process.env.MAPBOX_TOKEN;

//=================================================================================================

const Campground = require("../models/Campground");
const { cloudinary } = require("../media/config");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoderClient = mbxGeocoding({ accessToken: mbxToken });

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
	const geoData = await geocoderClient
		.forwardGeocode({
			query: req.body.newCamp.location,
			limit: 1,
		})
		.send();

	const { title, price, location } = req.body.newCamp;
	const camp = new Campground(req.body.newCamp);

	camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.author = req.user._id;
	camp.geometry = geoData.body.features[0].geometry;

	await camp.save();
	req.flash("success", "Successfully created a new campground!");
	res.redirect(`/campgrounds/${camp._id}`);
};

const editCamp = async (req, res) => {
	const { id } = req.params;
	const { name, price, location } = req.body.newCamp;
	const targetCamp = await Campground.findByIdAndUpdate(id, req.body.newCamp);

	targetCamp.images.push(...req.files.map((f) => ({ url: f.path, filename: f.filename })));
	await targetCamp.save();

	if (req.body.delImg) {
		for (let filename of req.body.delImg) {
			await cloudinary.uploader.destroy(filename);
		}
		await targetCamp.updateOne({ $pull: { images: { filename: { $in: req.body.delImg } } } });
	}
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
