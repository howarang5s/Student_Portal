
const Student = require('../models/Studentmodel'); // Adjust path if necessary

const User = require('../models/Usermodel'); // Assuming you have the User model

const addStudent = async (req, res) => {
  // Check if the authenticated user is a teacher
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: 'Permission denied. Only teachers can add students.' });
  }

  const { name, email, grade, profile, subject, marks } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    // If no user found with this email, return error
    if (!existingUser) {
      return res.status(400).json({ message: 'No user found with this email. Please register the student first.' });
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
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req,res) => {
  try{
    const profile = await User.findOne({_id : req.userId });
    if (!profile){
      return res.status(404).json({ message: 'Teacher not found' });
    }
    return res.status(200).json(profile)
  }catch{
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getStudentProfile = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only view students you are associated with.' });
    }
    return res.status(200).json(student)
  }catch{
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getStudentbyId = async (req,res) => {
  const { studentId } = req.params; 
  try{
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only view students you are associated with.' });
    }
    return res.status(200).json(student)
  }catch{
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getAllStudents = async (req, res) => {
  try {
    // If the authenticated user is a teacher, fetch only the students added by the teacher
    if (req.userRole === 'teacher') {
      const students = await Student.find({ addedBy: req.userId }); // Filter students by the teacherId

      if (students.length === 0) {
        return res.status(404).json({ message: 'No students found for this teacher' });
      }

      return res.status(200).json(students); // Return the list of students added by the teacher
    }

    // If the authenticated user is a student, fetch only their profile
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student); // Return the student's own profile
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Teacher can update a student's profile
const updateAnyStudentProfile = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: 'Permission denied. Only teachers can update students.' });
  }

  const { studentId } = req.params; // Get studentId from URL params

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only update students you are associated with.' });
    }

    // Update student's profile and grade
    student.marks = req.body.marks || student.marks;
    student.subject = req.body.subject || student.subject;
    student.profile = req.body.profile || student.profile;
    student.grade = req.body.grade || student.grade;

    await student.save();

    res.status(200).json({ message: 'Student profile updated successfully', student });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher can delete a student
const deleteStudent = async (req, res) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: 'Permission denied. Only teachers can delete students.' });
  }

  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure the student belongs to the current teacher
    if (student.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete students you are associated with.' });
    }

    await student.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTeacherProfile = async (req, res) => {
  // Validate the teacher role
  if (req.userRole !== 'teacher') {
    return res.status(403).json({ message: 'Permission denied. Only teachers can update their profile.' });
  }

  const { name, email } = req.body;  
  const { teacherId } = req.params;

  // Validate input fields
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required fields.' });
  }

  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate email format
  const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Find the teacher by ID and update their profile
    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Student not found' });
    }

    
    teacher.name = req.body.name || teacher.email;
    teacher.email = req.body.email || teacher.email;

    await teacher.save();

    // Return the updated teacher profile
    res.status(200).json({ message: 'Profile updated successfully', teacher });
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try{

    const users = await User.find();

    res.status(200).json(users); // Return the student's own profile
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
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
