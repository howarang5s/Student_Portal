const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodel');
const crypto = require('crypto');
const sendmail = require('../sendMail');
const {server_Error,response_Error} = require('../utils/error_and_responses')

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
          return res.status(400).json({ message: server_Error.email_verification_error});
      }
      console.log('user exists')

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(name)) {
          return res.status(400).json({ message: server_Error.name_format_error });
      }
      console.log('name is ok')

      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: server_Error.email_already_error });
      }
      console.log('email is ok')

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).json({ message: server_Error.password_verification_error });
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

      res.status(201).json({ message: response_Error.register_sucess, emailToken });

  } catch (error) {
      
      res.status(500).json({ message: response_Error.server_error });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: server_Error.email_verification_error });
    }
    
    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: server_Error.password_verification_error });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: server_Error.user_notfound });
    }
    

    // Compare entered password with stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: server_Error.credentials_error });
    }
    

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
    res.status(200).json({ message: response_Error.login_sucess, user,token });

  } catch (error) {
    
    res.status(500).json({ message: server_Error.server_error });
  }
};




// 1️⃣ Check if User Exists & Prompt for New Password
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const emailToken = crypto.randomBytes(64).toString("hex");
  console.log('Email TOken')

  try {
    
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: server_Error.email_verification_error });
    }
    console.log('email is ok');
    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: server_Error.password_verification_error });
    }
    console.log('password is ok');
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: server_Error.user_notfound  });
    }
    console.log('User',user);

    if (!newPassword) {
      return res.json({ message: server_Error.new_password_error });
    }

    

    user.password = newPassword;
    user.emailToken = emailToken;
    console.log('email is ok');
    await user.save();

    console.log('Email TOken',emailToken);
    sendmail(email, emailToken);

    res.json({ message: response_Error.forget_password_sucess,emailToken });
  } catch (error) {
    res.status(500).json({ message: server_Error.server_error, error });
  }
};





module.exports = { registerUser, loginUser, forgotPassword};
