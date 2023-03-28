const UserModel = require("../model/user-model");
const AddressModel = require("../model/address-model");
const bcrypt = require("bcrypt");
const niv = require("node-input-validator");
const fs = require("fs");
const excelJs = require("exceljs");
const readXlsxFile = require("read-excel-file/node");

// exporting data to csv file-----
exports.exportUser = async (req, res) => {
  try {
    // ################ For User column only ####################
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("user");
    worksheet.columns = [
      { header: "ID", key: "_id" },
      { header: "name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Password", key: "password" },
      { header: "Date", key: "date" },
      { header: "Gender", key: "gender" },
      { header: "Phone", key: "phone" },
    ];
    let counterOne = 1;
    let userData = await UserModel.find();
    console.log(userData);

    // user export loop
    for (let index = 0; index < userData.length; index++) {
      let data = userData[index];
      console.log(data);
      data.s_no = counterOne;
      worksheet.addRow(data);
      counterOne++;
    }
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // address column
    const AddressWorkBook = new excelJs.Workbook();
    const AddressWorksheet = workbook.addWorksheet("address");

    AddressWorksheet.columns = [
      { header: "ID", key: "_id" },
      { header: "Address", key: "address" },
      { header: "City", key: "city" },
      { header: "State", key: "state" },
      { header: "Pincode", key: "pincode" },
    ];

    let counterTwo = 1;
    let addressData = await AddressModel.find();
    console.log(addressData);
    // address export loop
    for (let index = 0; index < addressData.length; index++) {
      let data = addressData[index];

      console.log(data);
      data.s_no = counterTwo;
      AddressWorksheet.addRow(data);
      counterTwo++;
    }
    AddressWorksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    console.log("72")
    res.setHeader("Content-Disposition", `attatchement;filename=address.xlsx`);
    res.setHeader("Content-Disposition", `attatchement;filename=user.xlsx`);
    workbook.xlsx.write(res)
    
  } catch (error) {
    res.status(400).json({ message: error.message,
      status: false,
    message : " not in progress"});
  };
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
