
const Student = require('../models/Studentmodel'); 
const User = require('../models/Usermodel');
const {SERVER_ERROR, RESPONSE_ERROR} = require('../utils/constant')


const addStudent = async (req, res) => {
  
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_denied });
  }

  const { name, email, grade, profile, subject, marks } = req.body;
  

  try {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.name_format_error });
    }

    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.email_verification_error });
    }

    const existingUser = await User.findOne({ email });
    

    
    if (!existingUser) {
      return res.status(400).json({ message: SERVER_ERROR.existing_user });
    }

    
    const studentData = {
      userId: existingUser._id, 
      name,
      email,
      subject,
      marks,
      grade,
      profile,
      addedBy: req.userId, 
    };
    const newStudent = new Student(studentData);
    
    await newStudent.save();

    
    res.status(201).json({ message: RESPONSE_ERROR.STUDENTS_ADDED, student: newStudent });
  } catch (error) {
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
  
const getStudentbyId = async (req,res) => {
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

const getAllStudents = async (req, res) => {
  try {
    if (req.userRole === 'teacher') {
      const students = await Student.find({ addedBy: req.userId }); 
      
      if (students.length === 0) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
      }

      return res.status(200).json(students); 
    }

    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    res.status(200).json(student); 
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const updateAnyStudentProfile = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_to_update });
  }

  const { studentId } = req.params; 

  try {
    const student = await Student.findById(studentId);
    

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.student_existence });
    }

    
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.student_associated });
    }
    
    
    student.marks = req.body.marks || student.marks;
    student.profile = req.body.profile || student.profile;
    student.grade = req.body.grade || student.grade;

    await student.save();

    res.status(200).json({ message: SERVER_ERROR.update_student, student });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const deleteStudent = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_to_delete });
  }

  const { studentId } = req.params;
  

  try {
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    
    if (student.addedBy.toString() !== req.userId) {
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

const getfilteredStudents = async (req, res) => {
  try {
    
    const allStudents = await User.find({ role: 'student' });

    
    const assignedStudents = await Student.find({}, 'name');

    
    const assignedStudentNames = assignedStudents.map(student => student.name);

    
    const unassignedStudents = allStudents
      .map(user => user.name)
      .filter(name => !assignedStudentNames.includes(name));

    res.json({ students: unassignedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
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
  getfilteredStudents
  
};
