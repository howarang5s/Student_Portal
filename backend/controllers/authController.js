const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodel');
const crypto = require('crypto');
const sendOTPEmail = require('../sendMail');
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant')


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash(password, salt); 
    
    return hash;
}


async function comparePassword(enteredPassword, storedHash) {

    const isMatch = await bcrypt.compare(enteredPassword, storedHash); 

    return isMatch;
}



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  

  try {
    
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }
    
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFCIATION_ERROR });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: SERVER_ERROR.USER_NOT_FOUND });
    }
    

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: SERVER_ERROR.CREDENTIALS });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: RESPONSE_ERROR.LOGIN_SUCCESS, user,token });

  } catch (error) {
    
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};

const sendMailTo = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 30 * 1000; 
    user.emailToken = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully", email, otp });

  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};




const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  

  
  try {
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be 8-10 characters, contain at least one letter, one number, and one special character." });
    }

    

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    console.log(user);
    
    
    user.password = newPassword;
    await user.save();


    res.json({ message: "OTP sent to your email. Please verify within 5 minutes." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







module.exports = {  loginUser, forgotPassword, sendMailTo};
