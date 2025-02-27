const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    subjects: {type: String, required: true},
    marks: {type: Number, required: true},
    comments: { type: String, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  },
  { timestamps: true }
);


studentSchema.pre('save', function (next) {
  if (!this.studentId) {
    return next(new Error('User ID is required'));
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema, 'students_marks');
