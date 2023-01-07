const route = require("express").Router();
const auth = require("../middleware/auth");
const postController = require("../controller/post.controller");

//Link (API Path) and control it with the functions from post-controller

//Get routes
route.get("/showUserPost", auth("User"), postController.showUserPosts);
route.get("/TargetPost/:id", auth("User"), postController.targetPost);
route.get("/userPagePost/:id", auth("User"), postController.userPagePost);

//Post Routes
route.post("/addPost", auth("User"), postController.addPost);
route.post("/deletePost/:id", auth("User"), postController.deletePost);
route.post("/deleteAllPosts", auth("User"), postController.deleteAllPosts);
route.post("/editPost/:id", auth("User"), postController.editPost);
route.post("/Comment/:id", auth("User"), postController.addComment);

// route.post("/ediPost/:id", auth("User"), async(req,res)=>{
//     try{
//         const editPost = await postModel.findByIdAndUpdate(req.params.id)
//         if(!editPost) throw new Error("Can't find post")
//         editPost.save()
//         res.status(200).send({
//             APIstatus:true,
//             data:editpost,
//             message:"Updated Successfuly"
//     })
//     }
//     catch(e){
//         res.status(500).send({
//             APIstatus:false,
//             message: e.message
//         })
//     }
// })

module.exports = route;
