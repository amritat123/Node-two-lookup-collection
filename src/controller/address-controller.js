const AddressModel = require('../model/address-model');
const express = require('express');
const niv = require('node-input-validator');
const excelJs = require('exceljs');

// exporting data to csv file-----
exports.exportAddress = async (req, res) => {
    try {
      console.log('1');
      const workbook = new excelJs.Workbook();
      const worksheet = workbook.addWorksheet("My Invoice");
      console.log('2');
      worksheet.columns = [
        { header: "ID", key: "_id" },
        { header: "address", key: "address" },
        { header: "street", key: "street" },
        { header: "city", key: "city" },
        { header: "state", key: "state" },
        { header: "country", key: "country" },
        { header: "pincode", key: "pincode" },
      ];
      console.log('3');
      let counter = 1;
      let addressData = await AddressModel.find();
      console.log(addressData);
      console.log('4');

  
      for (let index = 0; index < addressData.length; index++) {
        let data = addressData[index];
        console.log('5')
        console.log(data);
        data.s_no = counter;
        worksheet.addRow(data);
        counter++;
      }
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      console.log('6');
  
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
      );
      console.log('7');
  
      res.setHeader("Content-Disposition", `attatchement;filename=add.xlsx`);
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
  
exports.Addaddress = async (req, res) => {
    const objValidation = new niv.Validator(req.body, {
        address : "required",
    });
    // console.log(req.body)
    const match = await objValidation.check();
    // console.log(match);
    if(!match){
        return res.status(400).json({
            success : false,
            message : "validation failed",
            message : objValidation.errors
        });
    }
    if(match){
        try {
            const findAddress = await AddressModel.findOne({address:req.body.address});
            console.log(findAddress)
            if(findAddress){
                return res.status(400).json({
                    status : false,
                    message : "address already exists"
                });
            };
            const newAddress = new AddressModel({
                address : req.body.address,
                city : req.body.city,
                state : req.body.state,
                pincode : req.body.pincode,
                country : req.body.country
            });
            const result = await newAddress.save();
            return res.status(201).json({
                status : true,
                message : "address created successfully",
                data : result
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status : false,
                message : error.message,
                message: "address could not be saved"
            });
        };
    }
}