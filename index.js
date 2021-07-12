const express = require("express");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//=================================================================================================

app.get("/", (req, res) => {
	res.render("home");
});

//=================================================================================================

app.listen(3000, () => {
	console.log("YelpCamp is online on port 3000.");
});
