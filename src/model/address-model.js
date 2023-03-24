// address Schema-----
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
    },
    street: {
        type: String,
        
    },
    city: {
        type: String,
    
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    pincode: {
        type:Number,
    },
})

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;