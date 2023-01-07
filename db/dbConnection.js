const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://islam:TbEF00cfkBr5VqYT@mocha.lgqcneu.mongodb.net/?retryWrites=true&w=majority",
  () => {
    console.log("Database is connected");
  }
);

//mongodb+srv://mochauser:1234@mocha.msg5s.mongodb.net/mocha?retryWrites=true&w=majority
