const express = require("express");
const router = express.Router();
const {
  getContests,
  getContest,
  postContests,
  updateContest,
} = require("../controllers/ContestControllers");
const { getCodechefProfile } = require("../controllers/codechefController");

router.route("/").get(getContests).post(postContests);
router.route("/:id").get(getContest).put(updateContest);
router.route("/code").get(getCodechefProfile);

module.exports = router;
