const express = require("express");
const router = express.Router();
const {
  getContests,
  getContest,
  postContests,
  updateContest,
  deleteContest,
} = require("../controllers/ContestControllers");
const {
  getCodechefProfile,
  updateCodechefProfile,
  enrollUser,
  updateAllCodechefProfiles,
} = require("../controllers/CodechefController");

router.route("/").get(getContests).post(postContests);
router.route("/:id").get(getContest).put(updateContest).delete(deleteContest);
router
  .route("/codechef/:id")
  .get(getCodechefProfile)
  .put(updateCodechefProfile);
router.route("/codechef/enroll/:id").put(enrollUser);
router.route("/codechef/update/allusers").put(updateAllCodechefProfiles);

module.exports = router;
