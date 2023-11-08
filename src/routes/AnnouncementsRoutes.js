const express = require("express");
const router = express.Router();

const {
    getAnnouncements,
    postAnnouncements,
    getAnnouncement,
    updateAnnouncements,
} = require("../controllers/AnnouncementsController");

router.route("/").get(getAnnouncements).post(postAnnouncements);

module.exports = router;