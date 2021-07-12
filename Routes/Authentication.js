var express = require("express");
var passport = require("passport");

var Router = express.Router();

var User = require("../models/User");

function RegisterPage(req, res) {
    res.render("Authentication/RegisterPage.ejs");
}

function LoginPage(req, res) {
    res.render("Authentication/LoginPage.ejs");
}

function Registration(req, res) {
    var sbj = new User({ username: req.body.Username });
    User.register(sbj, req.body.Password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local", {
            successRedirect: "/campgrounds",
            failureRedirect: "/campgrounds"
        })(req, res);
    });
}

function LogOut(req, res) {
    req.logout();
    res.redirect("/campgrounds");
}

function LoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//========================================================================================

Router.get("/register", RegisterPage);

Router.post("/register", Registration);

Router.get("/Login", LoginPage);

Router.post("/login", passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), function(req, res) {});

Router.get("/logout", LogOut);

module.exports = Router;