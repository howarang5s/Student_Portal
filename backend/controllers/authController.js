const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodel');

// Hash Password function
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hash = await bcrypt.hash(password, salt); // Hash the password
    console.log("Generated Hash:", hash); // Debugging line to check generated hash
    return hash;
}

// Compare Password function
async function comparePassword(enteredPassword, storedHash) {
    console.log("Entered Password:", enteredPassword); // Debugging entered password
    console.log("Stored Hash:", storedHash); // Debugging stored hash

    const isMatch = await bcrypt.compare(enteredPassword, storedHash); // Compare password with stored hash
    console.log("Password Match Status:", isMatch); // Debugging the result of comparison

    return isMatch;
}


const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Invalid name format' });
    }

    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one letter, one number and one special character' });
    }
    
    const newUser = new User({
      name,
      email,
      password,
      role,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User successfully registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'invalid password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    console.log("Hashed password in login:", user.password);  // Hashed password from DB
    console.log("Plain Text:", password);  // Plain text password from request

    // Compare entered password with stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
    res.status(200).json({ message: 'Login successful', token, userId: user._id, userRole: user.role });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};



// 1️⃣ Check if User Exists & Prompt for New Password
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    
    // Validate email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Invalid password format' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log('User',user);

    if (!newPassword) {
      return res.json({ message: 'User found. Please enter a new password.' });
    }
    console.log('User',newPassword);


    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};





module.exports = { registerUser, loginUser, forgotPassword };
