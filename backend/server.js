const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashbaordRoutes = require('./routes/dashboardRoutes');
const app = express();
const path = require('path')
const jwt = require('jsonwebtoken');
const User = require('./models/Usermodel')

dotenv.config();


connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher',teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashbaord',dashbaordRoutes);

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!user.emailToken || user.emailToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    user.emailToken = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "OTP verified successfully! You can now reset your password." });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
