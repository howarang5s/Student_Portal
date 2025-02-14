const express = require('express');
const { addTeacher,updateAnyTeacherProfile,getAllTeachers,deleteTeacher, getAllStudents, getTeacherbyId, getAdminProfile, updateAdminProfile,addStudent,deleteStudent,updateAnyStudentProfile, getStudentbyId, getAllStudentsByadmin } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authmiddleware'); // Make sure path is correct
const router = express.Router();

router.post('/addteacher', authenticate, addTeacher);
router.put('/updateTeacher/:teacherId', authenticate, updateAnyTeacherProfile);
router.delete('/deleteTeacher/:teacherId', authenticate, deleteTeacher);
router.get('/teachers',authenticate , getAllTeachers);
router.get('/students',authenticate , getAllStudents);
router.get('/adminstudents',authenticate, getAllStudentsByadmin)
router.get('/teacher/:teacherId', authenticate , getTeacherbyId);
router.get('/student/:studentId',authenticate,getStudentbyId)
router.get('/profile', authenticate, getAdminProfile);
router.put('/update/profile/:adminId', authenticate, updateAdminProfile);
router.post('/addStudent', authenticate, addStudent);
router.put('/updateStudent/:studentId', authenticate, updateAnyStudentProfile);
router.delete('/deleteStudent/:studentId', authenticate, deleteStudent);

module.exports = router;