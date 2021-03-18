var express = require("express");

var Router = express.Router();

var Camp = require("../models/Camp");
var Comment = require("../models/Comment")

function Cmt_Form(req, res) {
    Camp.findById(req.params.id, function(err, target_camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("Comment/CommentForm.ejs", { Campground: target_camp });
        }
    });
}

function Add_Cmt(req, res) {
    Camp.findById(req.params.id, function(err, target_camp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.Cmt, function(err, cmt) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds/" + req.params.id);
                } else {
                    target_camp.Comments.push(cmt);
                    target_camp.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
}

function LoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//========================================================================================

Router.get("/campgrounds/:id/comments/new", LoggedIn, Cmt_Form);

Router.post("/campgrounds/:id/comments", LoggedIn, Add_Cmt);

module.exports = Router;