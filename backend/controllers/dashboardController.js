
const Student = require('../models/Studentmodel');
const User = require('../models/Usermodel'); 
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant');


const dashboardStats = async (req, res) => {
  try {
      

      
      const studentsCount = await User.countDocuments({ role: "student" });
      const teachersCount = await User.countDocuments({ role: "teacher" });

      let topStudent = null;
      let highestMarks = -1;

      const students = await Student.find();

        if (students.length > 0) {
            students.forEach((student) => {
                if (student.marks > highestMarks) {
                    highestMarks = student.marks;
                    topStudent = student;
                }
            });
        }

        let topStudentDetails = null;

        if (topStudent) {
            
            const userDetails = await User.findOne({ _id: topStudent.studentId })
                .select("name email"); 
            
            if (userDetails) {
                
                topStudent = {
                    ...topStudent.toObject(),  
                    name: userDetails.name,
                    email: userDetails.email,
                };
            }
        }

      let topTeacher = null;
      const teachers = await User.find({ role: "teacher" });

      if (teachers.length > 0 && students.length > 0) {
        const teacherStudentCount = {};
    
        
        students.forEach((student) => {
            const teacherId = student.addedBy;
            if (teacherId) {
                teacherStudentCount[teacherId] = (teacherStudentCount[teacherId] || 0) + 1;
            }
        });
    
        let maxCount = 0;
        let bestTeacher = null;
    
        teachers.forEach((teacher) => {
            
            const count = teacherStudentCount[teacher._id] || 0;
            if (count > maxCount) {
                maxCount = count;
                bestTeacher = teacher;
            }
        });
    
        if (bestTeacher) {
            
            topTeacher = {
                _id: bestTeacher._id,
                name: bestTeacher.name,
                email: bestTeacher.email,
                studentCount: maxCount, 
                subjects: bestTeacher.subjects || [], 
            };
        } else {
            topTeacher = {
                _id: teachers[0]._id,
                name: teachers[0].name,
                email: teachers[0].email,
                studentCount: teacherStudentCount[teachers[0]._id] || 0,
                subjects: teachers[0].subjects || [],
            };
        }
      } else {
          return res.status(400).json({ message: SERVER_ERROR.STUDENTS_NOT_FOUND });
      }
    

      return res.status(200).json({
          studentsCount,
          teachersCount,
          topStudent,
          topStudentDetails,
          topTeacher,
      });
  } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};




module.exports = {
    dashboardStats,
    
};


