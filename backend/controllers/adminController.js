const Teacher = require('../models/Teachermodel'); // Adjust path if necessary
const Student = require('../models/Studentmodel');
const User = require('../models/Usermodel'); // Assuming you have the User model
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant');






const addStudent = async (req, res) => {
  // Check if the authenticated user is a teacher
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
  }

  const { name, email,password, subject } = req.body;
  console.log(name, email,password,subject);

  try {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR});
    }

    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFCIATION_ERROR });
    }
    const role = 'student';
    const emailToken = null;
    const newUser = new User({
        name,
        email,
        password,
        role,
        subject,
        emailToken,
        isVerifiedEmail: false
    });
    await newUser.save();
    // Check if a user with the provided email already exists
    // const existingUser = await User.findOne({ email });

    // // If no user found with this email, return error
    // if (!existingUser) {
    //   return res.status(400).json({ message: SERVER_ERROR.existing_user });
    // }

    // // If the user exists, use the user's id as the userId for the student
    // const studentData = {
    //   userId: existingUser._id, // Link student to the registered user
    //   name,
    //   email,
    //   subject,
    //   marks,
    //   grade,
    //   profile,
    //   addedBy: req.userId, // Set the teacher's userId as who added the student
    // };

    // // Create a new student document
    // const newStudent = new Student(studentData);

    // // Save the student record to the database
    // await newStudent.save();

    // Respond with success message and student object
    res.status(201).json({ message: RESPONSE_ERROR.STUDENTS_ADDED, user: newUser });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};

const addTeacher = async (req, res) => {
    
    
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
  
    const { name,email,password,subject } = req.body;
    
  
    try {

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
  
      // Validate email format
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }
      const role = 'teacher';
      const emailToken = null;
      
      const newUser = new User({
          name,
          email,
          password,
          role,
          subject,
          emailToken,
          isVerifiedEmail: false
      });
      await newUser.save();

      // const existingUser = await User.findOne({ email });
      
      //   // If no user found with this email, return error
      //   if (!existingUser) {
      //   return res.status(400).json({ message: SERVER_ERROR.EXISTING });
      //   }
      // // If the user exists, use the user's id as the userId for the student
      // const teacherData = {
      //   userId: existingUser._id, // Link student to the registered user
      //   name,
      //   email,
      //   password,
      //   course,
      // };
      
      // // Create a new student document
      // const newTeacher = new Teacher(teacherData);
  
      // // Save the student record to the database
      // await newTeacher.save();
  
      // Respond with success message and student object
      res.status(201).json({ message: RESPONSE_ERROR.STUDENTS_ADDED, user:newUser });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  const getAllTeachers = async (req, res) => {
    try {
      console.log(req.userRole)
      // If the authenticated user is a teacher, fetch only the students added by the teacher
      if (req.userRole==='admin') {
        
        const teachers = await User.find({role:'teacher'}); // Filter students by the teacherId
        
  
        if (teachers.length === 0) {
          return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
        }
  
        return res.status(200).json(teachers); // Return the list of students added by the teacher
      }
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  // Teacher can update a student's profile
  const updateAnyTeacherProfile = async (req, res) => {
    
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
    const { name, email,pass } = req.body;  
    const { teacherId } = req.params; // Get studentId from URL params
    
    
    try {
      

      const user = await User.findById(teacherId);
      
      
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }

      
      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(user.name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
    
      // Validate email format
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email
      user.subject = req.body.subject || user.subject;
      console.log('User:',user);
      await user.save();
      
  
      res.status(200).json({ message: RESPONSE_ERROR.UPDATE_STUDENT, user });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  const deleteTeacher = async (req, res) => {
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.permission_to_delete });
    }
  
    const { teacherId } = req.params;
    
    try {

      const user = await User.findById(teacherId);
      
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      
      await user.deleteOne();
      res.status(200).json({ message: RESPONSE_ERROR.DELETE });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
    }
  };
  
  const getAllStudents = async (req, res) => {
    try {
      
        const students = await User.find({role:'student'}); // Filter students by the teacherId
  
        if (students.length === 0) {
          return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
        }
  
        return res.status(200).json(students); // Return the list of students added by the teacher
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };
  const getAllStudentsByadmin = async (req, res) => {
    try {
        
        const students = await Student.find(); // Filter students by the teacherId
        if (students.length === 0) {
          return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
        }
  
        return res.status(200).json(students); // Return the list of students added by the teacher
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };
  

  const getAdminProfile = async (req,res) => {
    try{
      const profile = await User.findOne({_id : req.userId });
      if (!profile){
        return res.status(404).json({ message: SERVER_ERROR.TEACHER_NOT_FOUND });
      }
      return res.status(200).json(profile)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }
  
  const getStudentbyId = async (req,res) => {
    const { studentId } = req.params; 
    try{
      
      const user = await User.findById(studentId);
  
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      
      return res.status(200).json(user)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }

  const getTeacherbyId = async (req,res) => {
    const { teacherId } = req.params; 
    try{
      
      const teacher = await User.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      return res.status(200).json(teacher)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }

  const updateAdminProfile = async (req, res) => {
    
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED_TO_UPDATE_TEACHER_PROFILE });
    }
  
    const { name, email } = req.body;  
    const { adminId } = req.params;
  
    
    if (!name || !email) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_AND_EMAIL });
    }
  
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
    }
  
    
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }
  
    try {
      
      const admin = await User.findById(adminId);
      console.log(admin);
  
      if (!admin) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      
      admin.name = req.body.name || admin.email;
      admin.email = req.body.email || admin.email;
      await admin.save();
  
      // Return the updated teacher profile
      res.status(200).json({ message: RESPONSE_ERROR.TEACHER_UPDATE, admin });
    } catch (error) {
      
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  
  const updateAnyStudentProfile = async (req, res) => {
    
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
    const { name, email,pass } = req.body;  
    const { studentId } = req.params; // Get studentId from URL params
    
    
    try {
      const user = await User.findById(studentId);
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      console.log(user);
      
      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(user.name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
      console.log('email is ok'); 
      // Validate email format
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }
      console.log('password is ok'); 
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.subject = req.body.subject || user.subject;
  
      await user.save();
  
      res.status(200).json({ message: RESPONSE_ERROR.UPDATE_STUDENT, user });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };
  
  // Teacher can delete a student
  const deleteStudent = async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
  
    const { studentId } = req.params;
  
    try {
      const user = await User.findById(studentId);
      console.log(user);
  
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      
      await user.deleteOne();
      res.status(200).json({ message: RESPONSE_ERROR.DELETE });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
    }
  };
  
  

  module.exports = {
    addTeacher,
    updateAnyTeacherProfile,
    deleteTeacher,
    getAllTeachers,
    getAllStudents,
    getTeacherbyId,
    getStudentbyId,
    getAdminProfile,
    updateAdminProfile,
    addStudent,
    updateAnyStudentProfile,
    deleteStudent,
    getAllStudentsByadmin
    
  };