const express = require('express');
const { loginUser, forgotPassword, sendMailTo } = require('../controllers/authController');
const router = express.Router();

router.post('/', loginUser);
router.post('/forgot-Password',forgotPassword);
router.post('/sendMailto',sendMailTo);


module.exports = router;
