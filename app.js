var express = require("express");
var BodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var PassportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/User");
var Camp = require("./models/Camp");
var Comment = require("./models/Comment")
var SeedDB = require("./seed");

var CampgroundRoutes = require("./Routes/Campgrounds");
var CommentRoutes = require("./Routes/Comments");
var AuthenticationRoutes = require("./Routes/Authentication");

mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/YlpCmp", { useNewUrlParser: true });

var app = express();

app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("express-session")({
    secret: "Ignis aurum probat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=========================================================================================

app.use(function(req, res, next) {
    res.locals.CurrentUser = req.user;
    next();
});

//=========================================================================================

SeedDB();

app.use(CampgroundRoutes);
app.use(CommentRoutes);
app.use(AuthenticationRoutes);

//=========================================================================================

app.listen(3000, process.env.IP, function() { console.log("Server is online") });