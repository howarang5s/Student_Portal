const Teacher = require('../models/Teachermodel'); // Adjust path if necessary

const User = require('../models/Usermodel'); // Assuming you have the User model
const {server_Error,response_Error} = require('../utils/error_and_responses')


const addTeacher = async (req, res) => {
    // Check if the authenticated user is a teacher
    console.log('User Role',req.userRole);
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: server_Error.permission_denied });
    }
  
    const { name,email,password,course } = req.body;
    console.log('User',req.body);
  
    try {
        const role = 'teacher';
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

      const existingUser = await User.findOne({ email });
      
        // If no user found with this email, return error
        if (!existingUser) {
        return res.status(400).json({ message: server_Error.existing_user });
        }
      // If the user exists, use the user's id as the userId for the student
      const teacherData = {
        userId: existingUser._id, // Link student to the registered user
        name,
        email,
        password,
        course,
      };
      console.log(teacherData);
      // Create a new student document
      const newTeacher = new Teacher(teacherData);
  
      // Save the student record to the database
      await newTeacher.save();
  
      // Respond with success message and student object
      res.status(201).json({ message: response_Error.student_added, teacher: newTeacher, user:newUser });
    } catch (error) {
      res.status(500).json({ message: server_Error.server_error });
    }
  };

  const getAllTeachers = async (req, res) => {
    try {
      console.log(req.userRole)
      // If the authenticated user is a teacher, fetch only the students added by the teacher
      if (req.userRole==='admin') {
        console.log('lets find teachers');
        const teachers = await Teacher.find(); // Filter students by the teacherId
        console.log('Teachers',teachers);
  
        if (teachers.length === 0) {
          return res.status(404).json({ message: server_Error.student_not_exist });
        }
  
        return res.status(200).json(teachers); // Return the list of students added by the teacher
      }
    } catch (error) {
      res.status(500).json({ message: server_Error.server_error });
    }
  };

  // Teacher can update a student's profile
  const updateAnyTeacherProfile = async (req, res) => {
    console.log('User Role',req.userRole);
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: server_Error.permission_denied });
    }
    const { teacherId } = req.params; // Get studentId from URL params
    console.log(teacherId);
    try {

      const teacher = await Teacher.findById(teacherId);
      console.log(teacher);
  
      if (!teacher) {
        return res.status(404).json({ message: server_Error.student_existence });
      }
  
      // Update teacher's profile and grade
      teacher.course = req.body.course || teacher.course;
  
      await teacher.save();
  
      res.status(200).json({ message: server_Error.update_student, teacher });
    } catch (error) {
      res.status(500).json({ message: server_Error.server_error });
    }
  };

  const deleteTeacher = async (req, res) => {
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: server_Error.permission_to_delete });
    }
  
    const { teacherId } = req.params;
  
    try {
      const teacher = await Teacher.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: server_Error.student_existence });
      }
  
      await teacher.deleteOne();
      res.status(200).json({ message: response_Error.delete_student });
    } catch (error) {
      res.status(500).json({ message: server_Error.server_error});
    }
  };

  module.exports = {
    addTeacher,
    updateAnyTeacherProfile,
    deleteTeacher,
    getAllTeachers
  };