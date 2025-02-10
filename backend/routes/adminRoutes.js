const express = require('express');
const { addTeacher,updateAnyTeacherProfile,getAllTeachers,deleteTeacher } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authmiddleware'); // Make sure path is correct
const router = express.Router();

router.post('/add', authenticate, addTeacher);
router.put('/update/:teacherId', authenticate, updateAnyTeacherProfile);
router.delete('/delete/:teacherId', authenticate, deleteTeacher);
router.get('/teachers',authenticate , getAllTeachers);

module.exports = router;