const express = require('express');
const { addTeacher,updateAnyTeacherProfile,getAllTeachers,deleteTeacher, getAllStudents, getTeacherbyId, getAdminProfile, updateAdminProfile,addStudent,deleteStudent,updateAnyStudentProfile, getStudentbyId, getAllStudentsByadmin, addCourse, editCourse, deleteCourse, getAllCourse, getCourseByCourseId,getCourses } = require('../controllers/adminController');
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
router.post('/addCourse',authenticate,addCourse);
router.put('/editCourse/:courseId',authenticate,editCourse);
router.delete('/deleteCourse/:courseId',authenticate,deleteCourse);
router.get('/getCourses',authenticate,getAllCourse);
router.get('/getCourseByCourseId/:courseId',authenticate,getCourseByCourseId);
router.get('/courses',authenticate,getCourses);

module.exports = router;