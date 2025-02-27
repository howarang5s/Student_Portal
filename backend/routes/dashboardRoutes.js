const express = require('express');
const { dashboardStats} = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authmiddleware'); 
const router = express.Router();

router.get('/dashboardStats',authenticate , dashboardStats);


module.exports = router;