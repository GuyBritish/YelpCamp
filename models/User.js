var mongoose = require("mongoose");
var PassportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(PassportLocalMongoose);

var User = mongoose.model("User", UserSchema);

module.exports = User;