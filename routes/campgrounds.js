const express = require("express");
const router = express.Router({ mergeParams: true });

const { storage } = require("../media/config");
const multer = require("multer");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");

const { isAuth, checkAuthorCamp, validateCamp } = require("../middleware");

const Control = require("../controllers/campgrounds_Control");

//=================================================================================================

router.get("/", catchAsync(Control.indexPage));

router.get("/new", isAuth, Control.newCampForm);

router.get("/:id", catchAsync(Control.showCamp));

router.get("/:id/edit", isAuth, checkAuthorCamp, catchAsync(Control.editCampForm));

router.post("/", isAuth, upload.array("images"), validateCamp, catchAsync(Control.createCamp));

router.put("/:id", isAuth, checkAuthorCamp, validateCamp, catchAsync(Control.editCamp));

router.delete("/:id", isAuth, checkAuthorCamp, catchAsync(Control.deleteCamp));

//=================================================================================================

module.exports = router;
