const UserModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const niv = require("node-input-validator");
const fs = require("fs");
const ExcelJS = require("exceljs");
const excelToJson = require("convert-excel-to-json");
const MongoClient = require('../database/db');

exports.exportData = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("users");
    console.log("1")
    // wht we need inside of bookSheet --
    worksheet.columns = [
      {
        Headers: "S.No",
        key: "s_no",
        Headers: "Name",
        key: " name",
        Headers: "Email",
        key: "email",
        Headers: "Phone",
        key: "phone",
        Headers: "Gender",
        key: "gender",
        Headers: "Image",
        key: "image",
        Headers: "Password",
        key: "password"
      },
    ];
    let counter = 1;
    const userData = await UserModel.find();
    console.log("2")
    userData.forEach((user) => {
      user.s_no = counter;
      worksheet.addRow(user);
      counter++;
    });
    console.log("3")

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    console.log("4")

    // Downloading csv file --- 
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    console.log("5")
    res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);
    console.log("6")
    return  workbook.xlsx.write(res).then(()=> {
      res.status(200).json({
        message: "Data has been exported successfully",
        success: true,
      });
    }) 
  } catch (error) {
    console.log(error , "100000000000000000");
    res.status(500).json({
      message: error.message,
    });
  }
};

// import the excel file to the mongodb database
exports.importData = async (req, res) => {
    // Read the Excel file to the json data
    const excelData = excelToJson({
      sourceFile: filePath,
      // excel sheet name is optional
      sheetName: [{
        name : "users.xlsx",

        Headers : {
          rows: 1
        },
        columnToKey : {
          A: "s_no",
          B: "name",
          C: "email",
          D: "phone",
          E: "gender"
        }

      }]
    });
  console.log(excelData);
  //  Insert json object to mongodb 
  MongoClient.connect ( url , { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = dbo.db("exceldb");
    dbo.collection("users").insertMany(excelData, (err, result) => {
      if (err) throw err;
      console.log(" records inserted");
      db.close();
    });
  });
  fs.unlinkSync(filePath);
  
}

// add user
exports.addUser = async (req, res) => {
  let objValidation = new niv.Validator(req.body, {
    name: "required|maxLength:60",
    email: "required",
  });
  console.log("req.body :>> ", req.body);
  //   console.log(objValidation);
  const match = await objValidation.check();
  // console.log(match);
  if (!match) {
    return res.status(404).send({
      message: "validation error",
      errors: objValidation.errors,
    });
  }
  if (match) {
    // confirm the password
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
      return res.status(404).send({
        message: "password does not match please re-enter password",
        success: false,
      });
    }
  }
  try {
    let user = await UserModel.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(404).send({
        message: "user already exists",
        success: false,
      });
    }
    let hash = "";
    if (req.body.password) {
      hash = await bcrypt.hash(req.body.password, 10);
    }
    let image = "";
    if (req.file) image = req.file.path;
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      gender: req.body.gender,
      phone: req.body.phone,
      image,
    });

    const result = await newUser.save();

    return res.status(200).send({
      message: "user added  successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to register please try again later",
      success: false,
    });
  }
};

