// user route
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const UserModel = require("./../model/user-model");
const UserController = require("../controller/user-controller");

const readXlsxFile = require("read-excel-file/node");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});
router.post("/add_user", upload.single("image"), UserController.addUser);


// Uploading csv and saving data into db------------------------------
router.post("/csv", upload.single("csvFile"), async (req, res) => {
  console.log(req.file);
  try {
    let newArray = [];
    const dataRows = await readXlsxFile(req.file.path);
    // This line is used to skip the header line
    dataRows.shift();
    
    await dataRows.map(async (row) => {
      const newState = {
        name: row[0],
        email: row[1],
        password: row[2],
        gender: row[3],
        phone: row[4],
      };
      newArray.push(newState);
    });

    console.log(newArray, "newArray");

    const result = new UserModel(newArray[0]);
    await result.save();
    return res.send({
      message: "Product is successfully added",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Could not read the file: " + error,
    });
  }
});
module.exports = router;
