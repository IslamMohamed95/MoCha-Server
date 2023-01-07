const mongoose = require("mongoose")
const validator = require("validator")

const friendSchema = mongoose.Schema({
    userID:{type: mongoose.Schema.Types.ObjectId, ref: "Users" , required:true},
    name:{type:String,required:true,trim:true},
})

const Friend = mongoose.model("friends", friendSchema)
module.exports = Friend