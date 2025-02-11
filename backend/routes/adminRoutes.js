const express = require('express');
const { addTeacher,updateAnyTeacherProfile,getAllTeachers,deleteTeacher, getAllStudents, getTeacherbyId, getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authmiddleware'); // Make sure path is correct
const router = express.Router();

router.post('/add', authenticate, addTeacher);
router.put('/update/:teacherId', authenticate, updateAnyTeacherProfile);
router.delete('/delete/:teacherId', authenticate, deleteTeacher);
router.get('/teachers',authenticate , getAllTeachers);
router.get('/students',authenticate , getAllStudents);
router.get('/teacher/:teacherId', authenticate , getTeacherbyId);
router.get('/profile', authenticate, getAdminProfile);
router.put('/update/profile/:adminId', authenticate, updateAdminProfile);

module.exports = router;