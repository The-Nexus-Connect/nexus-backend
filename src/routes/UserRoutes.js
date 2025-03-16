const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserImage,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserControllers");

const upload = require('../../middlewares/uploadMiddleware');

router.route("/").get(getUsers);
router.route("/:id").get(getUser).put(updateUser);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

// Route to handle image upload
router.put('/upload/:id', upload, updateUserImage);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;