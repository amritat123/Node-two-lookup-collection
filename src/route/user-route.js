// user route
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const cej = require('convert-excel-to-json');
const UserController = require('../controller/user-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ "-" + file.originalname);
    },
  });
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
  });
  
// uploading excel sheet into database---------------------

router.post('/add_user',upload.single('image') , UserController.addUser)

router.get('/add', UserController.exportUser);

module.exports = router;