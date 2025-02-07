const mongoose = require('mongoose');

// Create a schema for the Student model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the User model (student)
  email: { type: String, required: true, unique: true }, // Email of the student
  grade: { type: String, required: true }, // Grade of the student
  subject: { type: String, required: true }, 
  marks: { type: Number, required: true },
  profile: { type: String, required: true }, // Profile description of the student
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The teacher who added this student
}, { timestamps: true });

// This ensures that a student cannot be added without a userId
studentSchema.pre('save', function (next) {
  if (!this.userId) {
    return next(new Error('User ID is required'));
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
