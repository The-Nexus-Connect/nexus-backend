const express =  require("express");
const router = express.Router();
const {registerUser, loginUser, currentUser} =  require("../controllers/UserControllers")


router.route("/").post(registerUser).post(loginUser);
// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);



module.exports = router;