const express = require("express");
const router = express.Router();
const {
  startRating,
  endRating,
  calcWinner,
} = require("../controllers/CodechefWinnerController");

router.route("/start").put(startRating);
router.route("/end").put(endRating);
router.route("/calculate/:contestName").get(calcWinner);

module.exports = router;
