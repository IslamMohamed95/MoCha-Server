const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://islam:mocha123@mocha.lgqcneu.mongodb.net/",
  () => {
    console.log("Database is connected");
  }
);

//mongodb+srv://mochauser:1234@mocha.msg5s.mongodb.net/mocha?retryWrites=true&w=majority
//mongodb+srv://islam:FvLwH4oG63BBzzeM@mocha.lgqcneu.mongodb.net/
//mongodb+srv://islam:FvLwH4oG63BBzzeM@mocha.lgqcneu.mongodb.net/mocha?retryWrites=true&w=majority
