const express =  require("express");
const router = express.Router();
const {getUsers,createUser,getUser,deleteUser,updateUser} =  require("../controllers/UserControllers")


router.route("/").get(getUsers);

router.route("/").post(createUser);

router.route("/:id").get(getUser);

router.route("/:id").put(updateUser);

router.route("/:id").delete(deleteUser);

module.exports = router;