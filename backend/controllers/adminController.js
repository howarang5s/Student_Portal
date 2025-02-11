const Teacher = require('../models/Teachermodel'); // Adjust path if necessary
const Student = require('../models/Studentmodel');
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
  
  const getAllStudents = async (req, res) => {
    try {
      
        const students = await Student.find(); // Filter students by the teacherId
  
        if (students.length === 0) {
          return res.status(404).json({ message: server_Error.student_not_exist });
        }
  
        return res.status(200).json(students); // Return the list of students added by the teacher
    } catch (error) {
      res.status(500).json({ message: server_Error.server_error });
    }
  };

  const getAdminProfile = async (req,res) => {
    try{
      const profile = await User.findOne({_id : req.userId });
      if (!profile){
        return res.status(404).json({ message: server_Error.teacher_not_found });
      }
      return res.status(200).json(profile)
    }catch{
      res.status(500).json({ message: server_Error.server_error });
    }
  }

  const getTeacherbyId = async (req,res) => {
    const { teacherId } = req.params; 
    try{
      
      const teacher = await Teacher.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: server_Error.student_existence });
      }
      return res.status(200).json(teacher)
    }catch{
      res.status(500).json({ message: server_Error.server_error });
    }
  }

  const updateAdminProfile = async (req, res) => {
    // Validate the teacher role
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: server_Error.permission_to_update_teacher_profile });
    }
  
    const { name, email } = req.body;  
    const { adminId } = req.params;
  
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
      const admin = await User.findById(adminId);
      console.log(admin);
  
      if (!admin) {
        return res.status(404).json({ message: server_Error.student_existence });
      }
  
      
      admin.name = req.body.name || admin.email;
      admin.email = req.body.email || admin.email;
      console.log(admin);
      await admin.save();
  
      // Return the updated teacher profile
      res.status(200).json({ message: response_Error.teacher_update, admin });
    } catch (error) {
      
      res.status(500).json({ message: server_Error.server_error });
    }
  };
  
  

  module.exports = {
    addTeacher,
    updateAnyTeacherProfile,
    deleteTeacher,
    getAllTeachers,
    getAllStudents,
    getTeacherbyId,
    getAdminProfile,
    updateAdminProfile
  };