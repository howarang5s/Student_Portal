const express = require('express');
const { registerUser, loginUser, forgotPassword, sendMailTo } = require('../controllers/authController');
const { getAllStudents } = require('../controllers/teacherController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/', loginUser);
router.post('/forgot-Password',forgotPassword);
router.post('/sendmail', sendMailTo);

module.exports = router;
