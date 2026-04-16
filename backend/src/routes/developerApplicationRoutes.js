const express = require('express');
const {
  createDeveloperApplication,
  listDeveloperApplications
} = require('../controllers/developerApplicationController');

const router = express.Router();

router.get('/developer-applications', listDeveloperApplications);
router.post('/developer-applications', createDeveloperApplication);

module.exports = router;
