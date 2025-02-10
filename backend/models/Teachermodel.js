const mongoose = require('mongoose');

// Create a schema for the Student model
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the User model (student)
  email: { type: String, required: true, unique: true }, // Email of the student
  password: { type: String, required: true },
  course: { type: String, required: true }, // Grade of the student
}, { timestamps: true });

// This ensures that a student cannot be added without a userId
teacherSchema.pre('save', function (next) {
  if (!this.userId) {
    return next(new Error('User ID is required'));
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
