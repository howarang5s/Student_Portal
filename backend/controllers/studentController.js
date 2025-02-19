const Student = require('../models/Studentmodel'); 
const {SERVER_ERROR} = require('../utils/constant')


const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });

    if (!student) {
      return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_FOUND });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


module.exports = { getStudentProfile };
