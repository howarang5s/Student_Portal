const Student = require('../models/Studentmodel'); // Adjust path if necessary
const {server_Error,response_Error} = require('../utils/error_and_responses')

// Get student profile (students can only see their own profile)
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: server_Error.student_not_found });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error });
  }
};


module.exports = { getStudentProfile };
