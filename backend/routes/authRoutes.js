const express = require('express');
const { loginUser, forgotPassword, sendMailTo, logoutUser, checkSession } = require('../controllers/authController');
const router = express.Router();

router.post('/', loginUser);
router.post('/forgot-Password',forgotPassword);
router.post('/sendMailto',sendMailTo);
router.post("/logout", logoutUser); 
router.post("/session/check", checkSession);






module.exports = router;
