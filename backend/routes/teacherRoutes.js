const express = require('express');
const { updateAnyStudentProfile, addStudent, deleteStudent, getAllStudents,getAllUsers, getProfile,getStudentProfile, getStudentbyId, getfilteredStudents, getTeacherStudentsStats } = require('../controllers/teacherController');
const { authenticate } = require('../middleware/authmiddleware')
const router = express.Router();

router.post('/add', authenticate, addStudent);
router.put('/update/:studentId', authenticate, updateAnyStudentProfile);
router.delete('/delete/:studentId', authenticate, deleteStudent);
router.get('/students',authenticate , getAllStudents);
router.get('/profile',authenticate, getProfile);
router.get('/student/profile/:studentId' , authenticate, getStudentProfile);
router.get('/student/:studentId' , authenticate, getStudentbyId);
router.get('/filteredStudents/:subject', authenticate, getfilteredStudents);
router.get('/users',authenticate, getAllUsers)
router.get('/dahboardstats',authenticate, getTeacherStudentsStats);

module.exports = router;
