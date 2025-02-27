
const Student = require('../models/Studentmodel'); 
const User = require('../models/Usermodel');
const {SERVER_ERROR, RESPONSE_ERROR} = require('../utils/constant')


const addStudent = async (req, res) => {
  if (req.userRole !== "teacher") {
    return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
  }

  const { email, comments, subjects, marks } = req.body;

  try {
    
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Student not found in User table" });
    }
    

    
    const studentData = {
      studentId: user._id, 
      subjects: subjects,
      marks: marks,
      comments,
      createdBy: req.userId,
    };

    const newStudent = new Student(studentData);
    
    await newStudent.save();

    return res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    console.error("Error adding/updating student:", error);
    
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry: This student has already been added." });
    }

    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const getProfile = async (req,res) => {
  try{
    const userId = req.userId;
    const teacher = await User.findOne({ _id:userId }).lean();
    if (!teacher){
      return res.status(404).json({ message: SERVER_ERROR.TEACHER_NOT_FOUND});
    }
    
    return res.status(200).json(teacher);
  }catch{
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
}

const getStudentProfile = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.STUDENTS_ASSOCIATED });
    }
    return res.status(200).json(student)
  }catch{
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
}
  
const getStudentbyId = async (req, res) => {
  const { studentId } = req.params;
  const { subject } = req.query;

  try {
    
    const student = await Student.findOne({ _id: studentId, subjects: subject });
    
    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }
    
    
    const studentUser = await User.findById(student.studentId).select('name email');
    
    if (!studentUser) {
      return res.status(404).json({ message: 'Student not found in User table' });
    }



    
    const studentResponse = {
      name: studentUser.name,
      email: studentUser.email,
      marks: student.marks,
      subject: student.subjects,
      comments: student.comments,
    };

    return res.status(200).json(studentResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const getAllStudents = async (req, res) => {
  try {
    if (req.userRole === 'teacher') {
      const { subject } = req.query;
      let { page, limit, sortField, sortOrder } = req.query;
      
      page = parseInt(req.query.page) || 1; 
      limit = parseInt(req.query.limit) || 10; 
      skip = (page - 1) * limit; 
      sortOrder = sortOrder === 'desc' ? -1 : 1;

      
      const totalStudents = await Student.countDocuments({ createdBy: req.userId, subjects: subject });

      const sortCriteria = {};
      if (sortField) {
          sortCriteria[sortField] = sortOrder;
      } else {
          sortCriteria['createdAt'] = -1; 
      }

      const students = await Student.find({ createdBy: req.userId, subjects: subject })
        .sort(sortCriteria)  
        .skip(skip) 
        .limit(limit) 
        .exec();

      if (!students.length) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
      }

      
      const studentDetails = await Promise.all(
        students.map(async (student) => {
          const userDetails = await User.findOne({ _id: student.studentId }).select("name email");
          let grade = '';
          if(student.marks > 0 && student.marks <= 33){
            grade = 'F';
          }else if(student.marks > 33 && student.marks <= 60){
            grade = 'B-';
          }else if(student.marks > 60 && student.marks <= 79){
            grade = 'B+';
          }else if(student.marks > 79 && student.marks <= 89){
            grade = 'A-';
          }else if(student.marks > 89 && student.marks <= 100){
            grade = 'A+';
          } 
          return {
            ...student.toObject(), 
            name: userDetails?.name || "Unknown",
            email: userDetails?.email || "Unknown",
            grade
          };
        })
      );

      return res.status(200).json({
        students: studentDetails,
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
      });
    } else {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const getTeacherStudentsStats = async (req, res) => {
  try {
    
    const students = await Student.find({ createdBy: req.userId });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found for this teacher" });
    }

    let totalPassedStudents = 0;
    let totalFailedStudents = 0;
    let bestStudent = null;
    let lowestStudent = null;
    let highestMarks = 50;
    let lowestMarks = Infinity;

    
    for (const student of students) {
      
      if (student.marks >= 34) {
        totalPassedStudents++;
      } else {
        totalFailedStudents++;
      }

      
      if (student.marks > highestMarks) {
        highestMarks = student.marks;
        bestStudent = student;
      }

      
      if (student.marks < lowestMarks && student.marks < 50) {
        lowestMarks = student.marks;
        lowestStudent = student;
      }
    }

    
    if (bestStudent) {
      const userDetails = await User.findOne({ _id: bestStudent.studentId }).select("name email");
      if (userDetails) {
        bestStudent = {
          ...bestStudent.toObject(),
          name: userDetails.name,
          email: userDetails.email,
        };
      }
    }

    if (lowestStudent) {
      const userDetails = await User.findOne({ _id: lowestStudent.studentId }).select("name email");
      if (userDetails) {
        lowestStudent = {
          ...lowestStudent.toObject(),
          name: userDetails.name,
          email: userDetails.email,
        };
      }
    }

    return res.status(200).json({
      totalPassedStudents,
      totalFailedStudents,
      bestStudent,
      lowestStudent,
    });
  } catch (error) {
    console.error("Error fetching teacher's students stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const updateAnyStudentProfile = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.PERMISSION_TO_UPDATE });
  }
  

  const { studentId } = req.params;
  const { subject } = req.query;
  const { comments, subjects, marks } = req.body; 
  
  try {
    const student = await Student.findOne({ _id: studentId, subjects: subject });
    
    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENT_EXISTENCE });
    }

    
    if (student.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.STUDENT_ASSOCIATED });
    }
    

    if (comments) student.comments = comments;
    if (marks) student.marks = marks;

    

    await student.save();
    res.status(200).json({ message: SERVER_ERROR.UPDATE_STUDENT, student });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const deleteStudent = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_to_delete });
  }
  
  const { studentId } = req.params;
  const { subject } = req.query
  

  try {
    const student = await Student.findOne({ _id: studentId, subjects: subject });
    
    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    
    if (student.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.STUDENTS_ASSOCIATED });
    }
    await student.deleteOne();
    res.status(200).json({ message: RESPONSE_ERROR.DELETE });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
  }
};


const getAllUsers = async (req, res) => {
  try{

    const users = await User.find();

    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR  });
  }
};

const mongoose = require('mongoose'); 

const getfilteredStudents = async (req, res) => {
  const { subject } = req.params;

  try {
    
    const addedStudents = await Student.find({ subjects: subject }).select('studentId');
    
    
    const addedStudentIds = addedStudents.map(student => new mongoose.Types.ObjectId(student.studentId));
    

    
    const students = await User.find({
      role: 'student',
      subjects: subject,  
      _id: { $nin: addedStudentIds } 
    });

    
    res.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};




module.exports = {
  addStudent,
  updateAnyStudentProfile,
  deleteStudent,
  getAllStudents,
  getProfile,
  getStudentProfile,
  getAllUsers,
  getStudentbyId,
  getfilteredStudents,
  getTeacherStudentsStats
  
};
