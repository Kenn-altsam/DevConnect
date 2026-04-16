const express = require('express');
const { createDeveloperApplication } = require('../controllers/developerApplicationController');

const router = express.Router();

router.post('/developer-applications', createDeveloperApplication);

module.exports = router;
