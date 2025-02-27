const express = require('express');
const { addStudent, getStudentProfile } = require('../controllers/studentController');
const { authenticate } = require('../middleware/authmiddleware'); 
const router = express.Router();

router.get('/profile', authenticate, getStudentProfile);

module.exports = router;
