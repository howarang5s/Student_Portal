
const Student = require('../models/Studentmodel'); // Adjust path if necessary
const Teacher = require('../models/Teachermodel');
const User = require('../models/Usermodel'); // Assuming you have the User model
const {server_Error,response_Error} = require('../utils/error_and_responses')


const addStudent = async (req, res) => {
  // Check if the authenticated user is a teacher
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: server_Error.permission_denied });
  }

  const { name, email,password, grade, profile, subject, marks } = req.body;
  console.log(name, email,password, grade, profile, subject, marks);

  try {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: server_Error.name_format_error });
    }
    console.log('name is passed');

    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: server_Error.email_verification_error });
    }
    console.log('email is passed');
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: server_Error.password_verification_error });
    }
    console.log('password is passed');
    const role = 'student';
    const emailToken = null;
    console.log('User creation');
    const newUser = new User({
        name,
        email,
        password,
        role,
        emailToken,
        isVerifiedEmail: false
    });
    await newUser.save();
    console.log(newUser);
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    // If no user found with this email, return error
    if (!existingUser) {
      return res.status(400).json({ message: server_Error.existing_user });
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

    // Create a new student document
    const newStudent = new Student(studentData);

    // Save the student record to the database
    await newStudent.save();

    // Respond with success message and student object
    res.status(201).json({ message: response_Error.student_added, student: newStudent });
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error });
  }
};

const getProfile = async (req,res) => {
  try{
    console.log(req.userId);
    const userId = req.userId;
    const teacher = await Teacher.findOne({ userId }).lean();
    console.log(teacher);
    if (!teacher){
      return res.status(404).json({ message: server_Error.teacher_not_found });
    }
    return res.status(200).json(teacher);
  }catch{
    res.status(500).json({ message: server_Error.server_error });
  }
}

const getStudentProfile = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: server_Error.student_associated });
    }
    return res.status(200).json(student)
  }catch{
    res.status(500).json({ message: server_Error.server_error });
  }
}

const getStudentbyId = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: server_Error.student_associated });
    }
    return res.status(200).json(student)
  }catch{
    res.status(500).json({ message: server_Error.server_error });
  }
}

const getAllStudents = async (req, res) => {
  try {
    // If the authenticated user is a teacher, fetch only the students added by the teacher
    if (req.userRole === 'teacher') {
      const students = await Student.find({ addedBy: req.userId }); // Filter students by the teacherId

      if (students.length === 0) {
        return res.status(404).json({ message: server_Error.student_not_exist });
      }

      return res.status(200).json(students); // Return the list of students added by the teacher
    }

    // If the authenticated user is a student, fetch only their profile
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    res.status(200).json(student); // Return the student's own profile
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error });
  }
};




// Teacher can update a student's profile
const updateAnyStudentProfile = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: server_Error.permission_to_update });
  }

  const { studentId } = req.params; // Get studentId from URL params

  try {
    const student = await Student.findById(studentId);
    console.log(student.name);
    const user = await User.findOne({name:student.name});
    console.log(user);

    if (!student) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: server_Error.student_associated });
    }
    user.email = req.body.email  || user.email;
    // Update student's profile and grade
    student.email = req.body.email || student.email;
    student.marks = req.body.marks || student.marks;
    student.subject = req.body.subject || student.subject;
    student.profile = req.body.profile || student.profile;
    student.grade = req.body.grade || student.grade;

    await user.save();
    await student.save();

    res.status(200).json({ message: server_Error.update_student, student });
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error });
  }
};

// Teacher can delete a student
const deleteStudent = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: server_Error.permission_to_delete });
  }

  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    const user = await User.findOne({name:student.name});
    console.log(user);

    if (!student) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: server_Error.student_associated });
    }
    await user.deleteOne();
    await student.deleteOne();
    res.status(200).json({ message: response_Error.delete_student });
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error});
  }
};

const updateTeacherProfile = async (req, res) => {
  // Validate the teacher role
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: server_Error.permission_to_update_teacher_profile });
  }

  const { name, email } = req.body;  
  const { teacherId } = req.params;

  // Validate input fields
  if (!name || !email) {
    return res.status(400).json({ message: server_Error.name_and_email_req });
  }

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: server_Error.name_format_error });
  }

  // Validate email format
  const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: server_Error.email_verification_error });
  }

  try {
    // Find the teacher by ID and update their profile
    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: server_Error.student_existence });
    }

    
    teacher.name = req.body.name || teacher.email;
    teacher.email = req.body.email || teacher.email;

    await teacher.save();

    // Return the updated teacher profile
    res.status(200).json({ message: response_Error.teacher_update, teacher });
  } catch (error) {
    
    res.status(500).json({ message: server_Error.server_error });
  }
};

const getAllUsers = async (req, res) => {
  try{

    const users = await User.find();

    res.status(200).json(users); // Return the student's own profile
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error  });
  }
};



module.exports = {
  addStudent,
  updateAnyStudentProfile,
  deleteStudent,
  getAllStudents,
  getProfile,
  getStudentProfile,
  updateTeacherProfile,
  getStudentbyId,
  getAllUsers
};
