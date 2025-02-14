
const Student = require('../models/Studentmodel'); // Adjust path if necessary
const Teacher = require('../models/Teachermodel');
const User = require('../models/Usermodel'); // Assuming you have the User model
const {SERVER_ERROR,respo, SERVER_ERRORnse_Error, RESPONSE_ERROR} = require('../utils/constant')


const addStudent = async (req, res) => {
  // Check if the authenticated user is a teacher
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_denied });
  }

  const { name, email, grade, profile, subject, marks } = req.body;
  console.log(name, email, grade, profile, subject, marks);

  try {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.name_format_error });
    }

    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.email_verification_error });
    }

    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({ message: SERVER_ERROR.password_verification_error });
    // }

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    // If no user found with this email, return error
    if (!existingUser) {
      return res.status(400).json({ message: SERVER_ERROR.existing_user });
    }

    // If the user exists, use the user's id as the userId for the student
    const studentData = {
      userId: existingUser._id, // Link student to the registered user
      name,
      email,
      subject,
      marks,
      grade,
      profile,
      addedBy: req.userId, // Set the teacher's userId as who added the student
    };
    console.log(studentData);

    // Create a new student document
    const newStudent = new Student(studentData);
    console.log(newStudent);
    // Save the student record to the database
    await newStudent.save();

    // Respond with success message and student object
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
    console.log(teacher);
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

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.STUDENTS_ASSOCIATED });
    }
    return res.status(200).json(student)
  }catch{
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
}
// const updateAnyStudentProfile = async (req, res) => {
//     if (req.userRole !== 'teacher') {
//       return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED_TO_UPDATE });
//     }
  
//     const { studentId } = req.params; // Get studentId from URL params
  
//     try {
//       const student = await Student.findById(studentId);
      
//       const user = await User.findOne({name:student.name});
  
//       if (!student) {
//         return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
//       }
  
//       // Ensure the student belongs to the current teacher
//       if (student.addedBy.toString() !== req.userId) {
//         return res.status(403).json({ message: SERVER_ERROR.STUDENTS_ASSOCIATED });
//       }
//       user.email = req.body.email  || user.email;
//       // Update student's profile and grade
//       student.email = req.body.email || student.email;
//       student.marks = req.body.marks || student.marks;
//       student.subject = req.body.subject || student.subject;
//       student.profile = req.body.profile || student.profile;
//       student.grade = req.body.grade || student.grade;
  
//       await user.save();
//       await student.save();
  
//       res.status(200).json({ message: SERVER_ERROR.UPDATE_STUDENT, student });
//     } catch (error) {
//       res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
//     }
//   };
  
const getStudentbyId = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    // Ensure the student belongs to the current teacher
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
    // If the authenticated user is a teacher, fetch only the students added by the teacher
    if (req.userRole === 'teacher') {
      const students = await Student.find({ addedBy: req.userId }); // Filter students by the teacherId
      
      if (students.length === 0) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
      }

      return res.status(200).json(students); // Return the list of students added by the teacher
    }

    // If the authenticated user is a student, fetch only their profile
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    res.status(200).json(student); // Return the student's own profile
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};





// Teacher can update a student's profile
const updateAnyStudentProfile = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_to_update });
  }

  const { studentId } = req.params; // Get studentId from URL params

  try {
    const student = await Student.findById(studentId);
    

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.student_existence });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.student_associated });
    }
    // Update student's profile and grade
    
    student.marks = req.body.marks || student.marks;
    student.profile = req.body.profile || student.profile;
    student.grade = req.body.grade || student.grade;

    await student.save();

    res.status(200).json({ message: SERVER_ERROR.update_student, student });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};

// Teacher can delete a student
const deleteStudent = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: SERVER_ERROR.permission_to_delete });
  }

  const { studentId } = req.params;
  console.log(studentId)

  try {
    const student = await Student.findById(studentId);
    console.log(student);

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: SERVER_ERROR.STUDENTS_ASSOCIATED });
    }
    await student.deleteOne();
    res.status(200).json({ message: RESPONSE_ERROR.DELETE });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
  }
};

// const updateTeacherProfile = async (req, res) => {
//   // Validate the teacher role
//   if (req.userRole !== 'teacher') {
//     return res.status(403).json({ message: SERVER_ERROR.permission_to_update_teacher_profile });
//   }

//   const { name, email } = req.body;  
//   const { teacherId } = req.params;

//   // Validate input fields
//   if (!name || !email) {
//     return res.status(400).json({ message: SERVER_ERROR.name_and_email_req });
//   }

//   const nameRegex = /^[A-Za-z\s]{2,50}$/;
//   if (!nameRegex.test(name)) {
//     return res.status(400).json({ message: SERVER_ERROR.name_format_error });
//   }

//   // Validate email format
//   const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: SERVER_ERROR.email_verification_error });
//   }

//   try {
//     // Find the teacher by ID and update their profile
//     const teacher = await User.findById(teacherId);

//     if (!teacher) {
//       return res.status(404).json({ message: SERVER_ERROR.student_existence });
//     }

    
//     teacher.name = req.body.name || teacher.email;
//     teacher.email = req.body.email || teacher.email;

//     await teacher.save();

//     // Return the updated teacher profile
//     res.status(200).json({ message: response_Error.teacher_update, teacher });
//   } catch (error) {
    
//     res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
//   }
// };

const getAllUsers = async (req, res) => {
  try{

    const users = await User.find();

    res.status(200).json(users); // Return the student's own profile
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR  });
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
  
};
