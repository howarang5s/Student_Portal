const express = require('express');
const { getAllStudents} = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authmiddleware'); // Make sure path is correct
const router = express.Router();

router.get('/students',authenticate , getAllStudents);


module.exports = router;