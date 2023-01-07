const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
// const User = require("../controller/user.controller") ????

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 8,
    },

    lastname: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 8,
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please Enter Email!"],
      unique: [true, "Email is used before"],
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email..!");
      },
      lowercase: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Password is required.."],
    },

    role: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
    },

    birthDate: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      trim: true,
    },

    profilePic: {
      type: String,
      trim: true,
      default: "",
    },

    friends: [{ friendID: { type: String } }],

    tokens: [{ token: { type: String, required: true } }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  //Disable(Password,...etc) from being display in Database
  const user = this.toObject();
  // delete user.password
  // delete user.__v
  const deletedItems = ["password", "__v"];
  deletedItems.forEach((item) => delete user[item]);
  return user;
};
userSchema.pre("save", async function () {
  //encrypt password before save
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);
});
userSchema.virtual("userPosts", {
  //Relation Between (users) and (posts)
  ref: "Posts",
  localField: "_id",
  foreignField: "userID",
});
userSchema.virtual("userRequests", {
  ref: "Request",
  localField: "_id",
  foreignField: "requestorId",
});

// userSchema.virtual("userFriends", {       //Relation between (UsersModel) and (FriendsModel)
//     ref:"friends",
//     localField: "_id",
//     foreignField:"userID"
// })
// userSchema.statics.loginUser = async (email, password)=>{        //Login Check (UserName & Password) + encrypt (Password)
//     const user = await userModel.findOne({email})
//     if(!user) throw new Error("User not found..!")
//     const passwordValidation = await bcrypt.compare(password, user.password)
//     if(!passwordValidation) throw new Error("Invaild Password..!")
//     return user
// }
// userSchema.methods.Token = async function(){                     //Generating Token and Decrypting it
//     const user = this
//     const token = jsonWebToken.sign({_id: user._id}, "TokenDecPass")
//     user.tokens = user.tokens.concat({token})
//     user.save()
//     return token
// }

const userModel = mongoose.model("users", userSchema); //Convert Schema to Model for being used by (Routes)
module.exports = userModel;
