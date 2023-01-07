const jsonWebToken = require("jsonwebtoken");
const userModel = require("../models/user.model");

// const generalAuth = async (req, res, next) =>{
//    try{
//        const token = req.header("Authorization").replace("Bearer ", '')
//        const decreptToken =  jsonWebToken.verify(token, "TokenDecPass")
//        const user = await userModel.findOne({_id:decreptToken._id, 'tokens.token': token})
//        if(!user) throw new Error()
//        req.user=user
//        req.token=token
//        next()
//    }
//    catch(e){
//        res.status(500).send({
//            APIstatus: false,
//            message: e.message
//        })
//    }
// }

// const userAuth = async (req, res, next) =>{
//     try{
//         const token = req.header("Authorization").replace("Bearer ", '')
//         const decreptToken =  jsonWebToken.verify(token, "TokenDecPass")
//         const user = await userModel.findOne({_id:decreptToken._id, 'tokens.token': token})
//         if(!user) throw new Error()
//         if(user.role != "User") throw new Error("u'r not user...!")
//         req.user=user
//         req.token=token
//         next()
//     }
//     catch(e){
//         res.status(500).send({
//             APIstatus: false,
//             message: e.message
//         })
//     }
//  }

//  const adminAuth = async (req, res, next) =>{
//     try{
//         const token = req.header("Authorization").replace("Bearer ", '')
//         const decreptToken =  jsonWebToken.verify(token, "TokenDecPass")
//         const user = await userModel.findOne({_id:decreptToken._id, 'tokens.token': token})
//         if(!user) throw new Error()
//         if(user.role != "Admin") throw new Error("u'r not authorized")
//         req.user=user
//         req.token=token
//         next()
//     }
//     catch(e){
//         res.status(500).send({
//             APIstatus: false,
//             message: "Unautorized"
//         })
//     }
//  }

const auth = (type) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decreptToken = jsonWebToken.verify(token, "TokenDecPass");
      const user = await userModel.findOne({
        _id: decreptToken._id,
        "tokens.token": token,
      });
      if (!user) throw new Error("user not found!");
      if (user.role != type) throw new Error("u'r not authorized");
      req.user = user;
      req.token = token;
      next();
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: "Unauthorized",
      });
    }
  };
};

module.exports = auth;
