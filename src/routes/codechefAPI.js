const express = require("express");
const router = express.Router();

const {
    getRating
} = require("../controllers/codechefControllers");

router.route("/").get(getRating);

module.exports = router;