const UserModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const niv = require("node-input-validator");
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
    // let image = "";
    // if (req.file) image = req.file.path;
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      gender: req.body.gender,
      phone: req.body.phone,
      // image,
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
