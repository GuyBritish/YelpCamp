var mongoose = require("mongoose");

var CommentSchema = mongoose.Schema({
    Text: String,
    Author: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;