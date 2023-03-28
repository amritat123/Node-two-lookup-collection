const express = require('express');
const addressController = require('../controller/address-controller');
const router = express();

router.post('/addAddress', addressController.Addaddress);
router.get('/export_Add', addressController.exportAddress);

module.exports = router;
