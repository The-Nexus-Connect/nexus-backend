const express = require("express");
const router = express.Router();
const {
    getContests,
} = require("../controllers/UserControllers");

router.route("/").get(getContests);
router.route("/codechef/:id").get(getContests);

module.exports = router;
