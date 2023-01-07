const route = require("express").Router()
const friendModel = require("../models/friends.model")
const auth = require("../middleware/auth")


route.post("/addFriend",auth("User"), async(req, res)=>{
    try{
        const newFriend = new friendModel({
            ...req.body,
            userID: req.user._id
        })
        await newFriend.save()
        res.status(200).send({
            APIstatus: true,
            data:newPost,
            message: "Friend added sucessfuly!"
        })
    }
    catch(e){
        res.status(500).send({APIstatus: false, message: e.message})
    }
})


route.get("/userFriends", auth("User"),async(req,res)=>{
    try{
        await req.user.populate({
            path:"userFriends",
            option:[]
        })
        res.status(200).send({
            APIstatus: true,
            data:req.user.userFriends,
            message: "Friend added sucessfuly!"
        })
    }
    catch(e){
        res.status(500).send({APIstatus: false, message: e.message})
    }
})

module.exports = route
