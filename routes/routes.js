const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/login", userController.userLogin);

router.get("/greeting", userController.userGreeting);

router.post("/register", userController.userRegister);

module.exports = router;
