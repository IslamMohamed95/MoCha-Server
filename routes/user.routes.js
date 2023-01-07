const route = require("express").Router();
const userController = require("../controller/user.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/imgeUpload");

//Link (API Path) and control it with the functions from user-controller

//Get Routes
route.get("/showAllUsers", auth("Admin"), userController.showAllUsers);
route.get("/profile", auth("User"), userController.profile);
route.get("/Friends", auth("User"), userController.Friends);
route.get("/users", auth("User"), userController.Users);
route.get("/friendPage/:id", userController.friendPage);
route.get("/userPage/:id", auth("User"), userController.userPage);

//Post Routes
route.post("/addFriend/:id", auth("User"), userController.addFriend);
route.post("/deleteFriend/:id", auth("User"), userController.removeFriend);
route.post(
  "/updateUserProfile",
  auth("User"),
  userController.updateProfileSettings
);
route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/logOutAllDev", auth("User"), userController.logOutAllDev);
route.post("/logOut", auth("User"), userController.logOut);
route.post(
  "/uploadProfilePic",
  auth("User"),
  upload.single("imgProfile"),
  userController.addProfilePic
);

module.exports = route;
