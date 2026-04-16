const express = require('express');
const { createProject, listProjects } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', listProjects);
router.post('/projects', createProject);

module.exports = router;
