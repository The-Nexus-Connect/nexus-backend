const Announcements = require("../models/announcementsModel");

//@desc Get all Announcements
//@route Get /api/announcements
//@access public
const getAnnouncements = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const announcements = await Announcements.find();

    res.status(200).json(announcements);
  } catch (error) {
    console.log(error);
  }
};

//@desc post announcements
//@route POST /api/anouncements
//@access public

const postAnnouncements = async (req, res) => {
  const apiKey = req.headers.authorization;
  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { name, description, priority, date } = req.body;

    // Check if the contest is already registered

    const announcement = await Announcements.create({
      name,
      description,
      priority,
      date,
    });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAnnouncements,
  postAnnouncements,
};
