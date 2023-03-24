// building user Schema........
const mongoose = require('mongoose');

let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    pinCode:{
        type: Number,
        required: true
    }
});

userSchema.plugin(aggregatePaginate);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);