const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");

const { isAuth, checkAuthorReview, validateReview } = require("../middleware");

const Control = require("../controllers/reviews_Control");

//=================================================================================================

router.post("/", isAuth, validateReview, catchAsync(Control.createReview));

router.delete("/:reviewId", isAuth, checkAuthorReview, catchAsync(Control.deleteReview));

//=================================================================================================

module.exports = router;
