const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student','admin'], default: 'teacher' }, // Role can be 'teacher' or 'student'
  isVerifiedEmail: {type:Boolean,defaultValue: false,},
  emailToken: {type: String,},
  
});


userSchema.pre('save', async function (next) {
  console.log('Lets save it')
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
