const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodel');
const crypto = require('crypto');
const sendOTPEmail = require('../sendMail');
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant')

// Hash Password function
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hash = await bcrypt.hash(password, salt); // Hash the password
    
    return hash;
}

// Compare Password function
async function comparePassword(enteredPassword, storedHash) {

    const isMatch = await bcrypt.compare(enteredPassword, storedHash); // Compare password with stored has

    return isMatch;
}


const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
      const emailToken = crypto.randomBytes(64).toString("hex");
      console.log('Email TOken')

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR});
      }
      console.log('user exists')

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(name)) {
          return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
      console.log('name is ok')

      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: SERVER_ERROR.EMAIL_ALREADY_ERROR });
      }
      console.log('email is ok')

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFCIATION_ERROR });
      }
      console.log('password is ok')

      
      const newUser = new User({
          name,
          email,
          password,
          role,
          emailToken,
          isVerifiedEmail: false
      });
      console.log('user created',newUser);

      // Send verification email **before saving**
      sendmail(email, emailToken);

      await newUser.save();
      console.log('user saved')

      res.status(201).json({ message: RESPONSE_ERROR.REGISTERATION_SUCCESS, emailToken });

  } catch (error) {
      
      res.status(500).json({ message: RESPONSE_ERROR.SERVER_ERR });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const otp = generateOTP(); // Generate OTP
  const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  console.log(otp);

  try {
    // Validate email format
    console.log('email is ok')
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }
    
    // Validate password format
    console.log('email is ok')
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFCIATION_ERROR });
    }

    // Check if user exists
    console.log('email is ok')
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: SERVER_ERROR.USER_NOT_FOUND });
    }
    console.log(user);

    // Compare entered password with stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: SERVER_ERROR.CREDENTIALS });
    }
    
    console.log(isMatch);
    user.emailToken = otp;
    await user.save();
    if(user.isVerifiedEmail=== false){
      sendOTPEmail(email, otp); // Send OTP via email
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
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

    console.log("Received email:", email);
    
    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    user.emailToken=otp;
    await user.save();

    // Send the OTP email
    sendOTPEmail(email, otp);

    // Respond with success and return the OTP (if needed for debugging)
    res.status(200).json({ message: "OTP sent successfully", email, otp });

  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};



// 1️⃣ Check if User Exists & Prompt for New Password
// const forgotPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   const emailToken = crypto.randomBytes(64).toString("hex");

//   try {
//     sendmail(email, emailToken);
//     // Validate email format
//     const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
//     }
//     // Validate password format
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
//     if (!passwordRegex.test(newPassword)) {
//       return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFCIATION_ERROR });
//     }
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: SERVER_ERROR.USER_NOT_FOUND  });
//     }

//     if (!newPassword) {
//       return res.json({ message: SERVER_ERROR.NEW_PASSWORD_ERROR });
//     }

    

//     user.password = newPassword;
//     user.emailToken = emailToken;
//     await user.save();

    

//     res.json({ message:RESPONSE_ERROR.FORGOT_PASSWORD_UPDATE,emailToken });
//   } catch (error) {
//     res.status(500).json({ message: SERVER_ERROR.SERVER_ERR, error });
//   }
// };

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  // const otp = generateOTP(); // Generate OTP
  // const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  // console.log(otp);

  
  try {
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be 8-10 characters, contain at least one letter, one number, and one special character." });
    }

    // sendOTPEmail(email, otp);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    console.log(user);
    // Update user with OTP and expiry time
    // user.emailToken = otp;
    if(user.isVerifiedEmail === true){
      user.password = newPassword;
      await user.save();
    }else{
      res.status(400).json({message: "First verify your email"})
    }
    

    // sendOTPEmail(email, otp); // Send OTP via email

    res.json({ message: "OTP sent to your email. Please verify within 5 minutes." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};







module.exports = { registerUser, loginUser, forgotPassword, sendMailTo};
