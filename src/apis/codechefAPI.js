const express = require("express");
const router = express.Router();
const {
    getRating,
} = require("../controllers/codechefController");

router.route("/").get(getRating);


module.exports = router;