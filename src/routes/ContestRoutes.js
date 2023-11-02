const express = require("express");
const router = express.Router();
const {
  getContests,
  getContest,
  postContests,
  updateContest,
} = require("../controllers/ContestControllers");
const { 
  getCodechefProfile,
  postCodechefProfile,

} = require("../controllers/codechefController");

router.route("/").get(getContests).post(postContests);
router.route("/:id").get(getContest).put(updateContest);
router.route("/codechef/:id").get(getCodechefProfile).post(postCodechefProfile);

module.exports = router;
