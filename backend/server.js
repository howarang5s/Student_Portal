const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {SERVER_ERROR, RESPONSE_ERROR} = require('./utils/constant')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashbaordRoutes = require('./routes/dashboardRoutes');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./models/Usermodel');

dotenv.config();

connectDB();


app.use(cors()); 
app.use(express.json()); 

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60,
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    domain: 'localhost', 
    sameSite: 'Lax' 
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashbaord', dashbaordRoutes);

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: SERVER_ERROR.USER_NOT_FOUND });
    }

    if (!user.emailToken || user.emailToken !== otp) {
      return res.status(400).json({ message: SERVER_ERROR.INAVLID_OTP });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: SERVER_ERROR.OTP_EXPIRED });
    }

    user.emailToken = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: RESPONSE_ERROR.OTP_VERIFY });

  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR, error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});