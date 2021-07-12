var mongoose = require("mongoose");


var CampSchema = new mongoose.Schema({
    Name: String,
    Image: String,
    Description: String,
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Camp = mongoose.model("Camp", CampSchema);

module.exports = Camp;