const Student = require('../models/Studentmodel'); 
const User = require('../models/Usermodel')
const {SERVER_ERROR} = require('../utils/constant')


const getStudentProfile = async (req, res) => {
  try {
    
    const studentRecords = await Student.find({ studentId: req.userId });

    if (!studentRecords || studentRecords.length === 0) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_FOUND });
    }

    
    const user = await User.findOne({ _id: req.userId }).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    
    const filteredSubjectsWithMarks = studentRecords
      .filter(student => student.marks !== undefined && student.marks !== null) 
      .map(student => ({
        subject: student.subjects, 
        marks: student.marks,
        comments: student.comments,
        createdBy: student.createdBy 
      }));

    
    const teacherIds = [...new Set(filteredSubjectsWithMarks.map(s => s.createdBy))];

    
    const teachers = await User.find({ _id: { $in: teacherIds } }).select("name email");

    
    const teacherMap = teachers.reduce((acc, teacher) => {
      acc[teacher._id] = { teacherName: teacher.name, teacherEmail: teacher.email };
      return acc;
    }, {});

    
    const subjectsWithTeachers = filteredSubjectsWithMarks.map(subject => ({
      ...subject,
      teacherName: teacherMap[subject.createdBy]?.teacherName || "Unknown",
      teacherEmail: teacherMap[subject.createdBy]?.teacherEmail || "Unknown"
    }));

    
    const studentProfile = {
      studentId: req.userId,
      name: user.name,
      email: user.email,
      subjects: subjectsWithTeachers
    };

    res.status(200).json(studentProfile);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};



module.exports = { getStudentProfile };
