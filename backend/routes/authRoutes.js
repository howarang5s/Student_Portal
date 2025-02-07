const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const { getAllStudents } = require('../controllers/teacherController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/', loginUser);
router.post('/forgot-Password',forgotPassword);


module.exports = router;
