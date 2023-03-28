const UserModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const niv = require("node-input-validator");
const fs = require("fs");
const excelJs = require("exceljs");
require("moment");
const readXlsxFile = require("read-excel-file/node");

// exporting data to csv file-----
exports.exportUser = async (req, res) => {
  try {
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("My Invoice");
    worksheet.columns = [
      { header: "ID", key: "_id" },
      { header: "name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Password", key: "password" },
      { header: "Date", key: "date" },
      { header: "Gender", key: "gender" },
      { header: "Phone", key: "phone" },
    ];
    let counter = 1;
    let userData = await UserModel.find();
    console.log(userData);

    for (let index = 0; index < userData.length; index++) {
      let data = userData[index];

      console.log(data);
      data.s_no = counter;
      worksheet.addRow(data);
      counter++;
    }
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );

    res.setHeader("Content-Disposition", `attatchement;filename=user.xlsx`);
    return workbook.xlsx.write(res).then(() => {
      // console.log("res", res);
      res.status(200).send({ message: "Successfully exported data to csv" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};
// read the xlsx file----
// file path --
// readXlsxFile("./users.xlsx").then((rows) => {
//   console.log(rows);
//   for (i in rows) {
//     for (j in rows[i]) {
//       console.log(rows[i][j]);
//     }
//   }
// });
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
