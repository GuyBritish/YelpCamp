var express = require("express");

var Router = express.Router();

var Camp = require("../models/Camp");

//========================================================================================

var arr = [];

function sve_Report(err, sbj) {
    if (err) {
        console.log("Could not save camp")
    } else {
        console.log("Camp saved successfully");
        console.log(sbj);
    }
}

function HomePage(req, res) {
    res.render("Campground/Home.ejs");
}

function Add_Camp(req, res) {
    var sbj = new Camp({
        Name: req.body.cmp_name,
        Image: req.body.cmp_img,
        Description: req.body.cmp_descrptn
    });
    sbj.save(sve_Report);
    res.redirect("/campgrounds");
}

function List_Camps(req, res) {
    Camp.find(function(err, sbj) {
        if (err) {
            console.log("Could not find camp");
        } else {
            arr = sbj;
            res.render("Campground/Camp_Lst.ejs", { camps: arr });
        }
    });
}

function Camp_Form(req, res) {
    res.render("Campground/NewCamp.ejs");
}

function Camp_Information(req, res) {
    Camp.findById(req.params.id).populate("Comments").exec(function(err, target_camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("Campground/Camp_Info.ejs", { Campground: target_camp });
        }
    });
}

//========================================================================================

Router.get("/", HomePage);

Router.get("/campgrounds", List_Camps);

Router.get("/campgrounds/new", Camp_Form);

Router.post("/campgrounds", Add_Camp);

Router.get("/campgrounds/:id", Camp_Information);

module.exports = Router;