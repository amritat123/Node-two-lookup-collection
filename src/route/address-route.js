const express = require('express');
const addressController = require('../controller/address-controller');
const router = express();

router.post('/addAddress', addressController.Addaddress);
module.exports = router;
