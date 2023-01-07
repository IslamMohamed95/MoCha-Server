const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
require("../db/dbConnection");

class User {
  //Register new user => (Admin or User)
  static register = async (req, res) => {
    try {
      const newUser = new userModel({ ...req.body, role: "User" });
      await newUser.save();
      res.status(200).send({
        APIstatus: true,
        message: "User Created Successfully",
        User: newUser,
      });
    } catch (e) {
      res.status(500).send({ APIstatus: false, message: e.message });
    }
  };

  static adminRegister = async (req, res) => {
    try {
      if (!req.body.role === "User") throw new Error("Pleas Enter Admin Type");
      const newAdmin = new userModel(req.body);
      await newAdmin.save();
      res.status(200).send({
        APIstatus: true,
        data: newAdmin,
        message: "Added Successfuly",
      });
    } catch (e) {
      res.status(500).send({ APIstatus: false, message: e.message });
    }
  };
  //Login
  static login = async (req, res) => {
    //Login Authentication
    try {
      const userData = await userModel.findOne({ email: req.body.email });
      if (!userData) throw new Error("User not found..!");
      const passwordValidation = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (!passwordValidation) throw new Error("Invalid Password..!");
      const token = jsonWebToken.sign({ _id: userData._id }, "TokenDecPass");
      userData.tokens.push({ token });
      userData.save();
      res.status(200).send({
        APIstatus: true,
        data: { userData, token },
        message: "Login Successfully",
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for only (Admin) to show all registered users
  static showAllUsers = async (req, res) => {
    //Display All Users
    try {
      const userData = await userModel.find();
      if (userData.length > 0) {
        res.status(200).send({
          APIstatus: true,
          data: userData,
        });
      } else {
        res.status(200).send({
          APIstatus: false,
          data: "No Data To Show",
        });
      }
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for only (Users) to view account profile
  static profile = async (req, res) => {
    res.send(req.user);
  };

  //Option for only (Users) to update his personal data account profile
  static updateProfileSettings = async (req, res) => {
    try {
      await userModel.updateMany(
        { _id: req.user._id },
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            password: await bcrypt.hash(req.body.password, 10),
          },
        }
      );
      res.status(200).send({
        APIstatus: true,
        message: "Data Updated Successfully",
        updatedUser: req.user,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for only (Users) to add profile Picture
  static addProfilePic = async (req, res) => {
    try {
      await userModel.updateOne(
        { _id: req.user._id },
        { profilePic: req.file.path }
      );
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for all (Admin & Users) => logout from all devices
  static logOutAllDev = async (req, res) => {
    try {
      if (req.user._id === req.user._id) {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send({ message: "Logout Successfully" });
      } else {
        res.status(200).send({ message: "Target user no found!" });
      }
    } catch (e) {
      res.send({ Status: "Failed..." });
    }
  };

  //Option for all (Admin & Users) => logout from one device
  static logOut = async (req, res) => {
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token != req.token;
    });
    req.user.save();
    res.send({ message: "Logout Successfully" });
  };

  //------------------ Friends Functionality --------------------//
  //Add friend
  static addFriend = async (req, res) => {
    try {
      if (req.user._id != req.params.id) {
        if (!req.user.friends.includes(req.params.id)) {
          var friend = await userModel.findByIdAndUpdate(req.params.id, {
            $push: { friends: { friendID: req.user._id } },
          });
          var user = await userModel.findByIdAndUpdate(req.user._id, {
            $push: { friends: { friendID: req.params.id } },
          });
          await friend.save();
          await user.save();
          res.status(200).send({
            APIstatus: true,
            message: "Followed User Successfully",
          });
        } else {
          res.status(404).send({
            APIstatus: true,
            message: "User is friend already",
          });
        }
      } else {
        res.status(403).send({
          APIstatus: true,
          message: "You can't add your self",
        });
      }
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //remove friend
  static removeFriend = async (req, res) => {
    try {
      const Friend = await userModel.findById(req.params.id);
      const user = await userModel.findById(req.user._id);
      user.friends = user.friends.filter((f) => f.friendID !== req.params.id);
      Friend.friends = Friend.friends.filter((f) => f.friendID !== req.user.id);
      user.save();
      Friend.save();
      res.status(200).send({
        APIstatus: true,
        message: "Friend deleted successfully",
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };
  //Show all user friends in friend's list
  static Friends = async (req, res) => {
    var Friends = [];
    for (let index = 0; index < req.user.friends.length; index++) {
      const Friend = await userModel.findById(req.user.friends[index].friendID);
      Friends.push(Friend);
    }
    res.send(Friends);
  };
  //Display friend page
  static friendPage = async (req, res) => {
    try {
      const Friend = await userModel.findById(req.params.id);
      res.status(200).send(Friend);
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };
  //--------------------------- End --------------------------//

  //---------------------- Public Search ---------------------//
  //getAllUsers
  static Users = async (req, res) => {
    try {
      const users = [];
      const allOtherUsers = await userModel.find({});
      for (let i = 0; i < allOtherUsers.length; i++) {
        if (allOtherUsers[i].id != req.user.id) {
          users.push(allOtherUsers[i]);
        }
      }
      res.status(200).send({
        APIstatus: true,
        allUsers: users,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };
  //------------------------ End -----------------------------//

  //----------------------- Get user Info. -------------------//
  static userPage = async (req, res) => {
    try {
      const userInfo = await userModel.findById(req.params.id);
      await userInfo.save();
      res.status(200).send({
        APIstatus: true,
        user: userInfo,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };
  //----------------------------------------------------------//
}
module.exports = User;
