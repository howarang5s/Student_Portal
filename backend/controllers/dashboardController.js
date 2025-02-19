
const Student = require('../models/Studentmodel');
const User = require('../models/Usermodel'); 
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant');


const getAllStudents = async (req, res) => {
    try {
        console.log('Students');
        const studentscount = await User.countDocuments({ role: 'student' });

        

        const teachercount = await User.countDocuments({ role: 'teacher' }); // Filter students by the teacherId
        

        let topStudent = null;
        const students = await Student.find()
        if (students.length > 0) {
            topStudent = students.reduce((prev, curr) => 
              curr.marks > prev.marks ? curr : prev, students[0]
            );
          
        }

        let topTeacher = null;
    
        const teachers = await User.find({role:'teacher'});
        if (teachers.length > 0 && students.length > 0) {
            const teacherStudentCount = {};      
            students.forEach((student, index) => {
              
              const teacherId = student.addedBy; 
              if (teacherId) {
                teacherStudentCount[teacherId] = (teacherStudentCount[teacherId] || 0) + 1;
              }     
            });
        
            let maxCount = 0;
            let teacHer = null
            teachers.forEach((teacher) => {
              const count = teacherStudentCount[teacher._id] || 0; 
              
              if (count > maxCount) {
                maxCount = count;
                teacHer = teacher;
              }
            });
        
            
            if (teacHer !== null) {
              console.log  
              topTeacher = teacHer;
            } else {
              topTeacher = teachers[0]; 
            }
            
          } else {
            res.status(400).json({message:SERVER_ERROR.STUDENTS_NOT_FOUND});
          }
  
          return res.status(200).json({
            studentscount,
            teachercount,
            topStudent,
            topTeacher,
          });
        
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };



module.exports = {
    getAllStudents,
    
};


