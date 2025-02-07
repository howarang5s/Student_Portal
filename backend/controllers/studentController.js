const Student = require('../models/Studentmodel'); // Adjust path if necessary

// Add a new student
// const addStudent = async (req, res) => {
//   // Verify that the authenticated user is a teacher
//   if (req.userRole !== 'teacher') {
//     return res.status(403).json({ message: 'Permission denied. Only teachers can add students.' });
//   }

//   const { name, email, grade, profile } = req.body;

//   try {
//     // Ensure all required fields are provided
//     if (!name || !email || !grade) {
//       return res.status(400).json({ message: 'Name, email, and grade are required.' });
//     }

//     // Check if a student with the given email already exists
//     console.log('Existing Student',email);
//     const existingStudent = await Student.findOne({ email });
//     console.log('Existing Student',existingStudent);
//     if (existingStudent) {
//       return res.status(400).json({ message: 'Student with this email already exists.' });
//     }

//     // Check if req.userId is available
//     console.log('User id in controller',req.userId);
//     if (!req.userId) {
//       console.error('Missing userId in request.');
//       return res.status(500).json({ message: 'Server error: User ID not found.' });
//     }

//     // Create a new student record
//     const newStudent = new Student({
//       name,
//       email,
//       grade,
//       profile: profile || '', // Default to empty string if profile is not provided
//       addedBy: req.userId, // ID of the teacher who added the student
//     });
//     console.log('New Student',newStudent);

//     // Save the new student in the database
//     await newStudent.save();
//     res.status(201).json({ message: 'Student added successfully', student: newStudent });
//   } catch (error) {
//     console.error('Error adding student:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// Get student profile (students can only see their own profile)
const getStudentProfile = async (req, res) => {
  try {
    console.log('User Id:',req.userId);
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: 'Contact to administration to confirm becuase you are not added by any teacher' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getStudentProfile };
