const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  registerUser,
  loginUser,
} = require("../controllers/UserControllers");

router.route("/").get(getUsers);
router.route("/:id").get(getUser).put(updateUser);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

const upload = require('../../middlewares/uploadMiddleware');
const { updateUserImage } = require('../controllers/UserControllers');

// Route to handle image upload
router.put('/upload/:id', upload, updateUserImage);

module.exports = router;