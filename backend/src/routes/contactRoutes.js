const express = require('express');
const { createContactRequest } = require('../controllers/contactController');

const router = express.Router();

router.post('/contact', createContactRequest);

module.exports = router;
