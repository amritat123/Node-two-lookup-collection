const AddressModel = require('../model/address-model');
const express = require('express');
const niv = require('node-input-validator');

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