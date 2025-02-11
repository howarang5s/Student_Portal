const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const path = require('path')
const jwt = require('jsonwebtoken');
const User = require('./models/Usermodel')

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Serve Angular build files
// const frontendPath = path.join(__dirname, 'frontend/build');
// app.use(express.static(frontendPath));

app.get('/api/verify/:token', async (req, res) => {
  try {
      const { token } = req.params;
      console.log(token);
      // Find the user by emailToken
      const user = await User.findOne({ emailToken: token });
      console.log('User',user);

      if (!user) {
          return res.status(400).send("Invalid verification link or user not found.");
      }

      // Update email verification status
      user.isVerifiedEmail = true;
      await user.save();

      res.json({
        message: "Email verified successfully!",
        isVerifiedEmail: user.isVerifiedEmail
      });
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error.");
  }
});

// // Serve the index.html file for any unknown routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
