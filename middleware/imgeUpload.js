const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let loc;
    if (!req.user) loc = "uploads";
    else loc = path.join("uploads", req.user._id.toString());
    fs.mkdir(loc, (err) => {});
    cb(null, loc);
  },

  filename: function (req, file, cb) {
    let name =
      file.filename + "-" + Date.now() + path.extname(file.originalname);
    cb(null, name);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
