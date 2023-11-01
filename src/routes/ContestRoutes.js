const express = require("express");
const router = express.Router();
const {
    getContests,
    getContest,
    postContests,
    updateContest,
} = require("../controllers/ContestControllers");

router.route("/").get(getContests).post(postContests);
router.route("/:id").get(getContest).put(updateContest);
// router.route("/codechef/").get(getContests);

module.exports = router;
