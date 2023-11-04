const express = require("express");
const router = express.Router();
const {
    startRating,
    endRating

} = require("../controllers/WinnerController");

router.route("/start").put(startRating);
router.route("/end").put(endRating);

module.exports = router;
