require("../db/dbConnection");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "*"
}));

const userRoutes = require("../routes/user.routes"); //Route For Users (Main Model)
const postRouter = require("../routes/posts.routes"); //Route For Posts cause it will be needed in (Admin User)
const requestRouter = require("../routes/requests.routes");
//const friendRouter = require("../routes/friends.routes")

app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRoutes); //API Path for (Users)
app.use("/api/post", postRouter); //API path for (Posts)
app.use("/api/req", requestRouter);
//app.use("/api/friend",friendRouter)

app.get("*", (req, res) => {
  res.status(404).send({
    apiStatus: false,
    message: "api invalid link",
  });
});

module.exports = app;
