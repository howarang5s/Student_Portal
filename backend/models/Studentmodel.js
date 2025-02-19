const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  email: { type: String, required: true, unique: true }, 
  grade: { type: String, required: true }, 
  subject: { type: String, required: true }, 
  marks: { type: Number, required: true },
  profile: { type: String, required: true }, 
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, { timestamps: true });


studentSchema.pre('save', function (next) {
  if (!this.userId) {
    return next(new Error('User ID is required'));
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema, 'students_marks');
