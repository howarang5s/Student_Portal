const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodel');
const crypto = require('crypto');
const sendOTPEmail = require('../sendMail');
const mongoose = require('mongoose');
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


async function forceLogoutSession(sessionId) {
  try {
    const sessionCollection = mongoose.connection.collection('sessions');
    console.log('Attempting to delete session:', sessionId); 
    const result = await sessionCollection.deleteOne({ _id: sessionId });
    console.log('Delete result:', result); 
    if (result.deletedCount > 0) {
      console.log(`Session ${sessionId} force-logged out.`);
      return true;
    } else {
      console.log(`Session ${sessionId} not found.`);
      return false;
    }
  } catch (error) {
    console.error('Error force-logging out session:', error);
    return false;
  }
}

const { ObjectId } = require('mongodb'); 
const activeSessions = {}

const Session = require("../models/Sessions"); 

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    
    const existingSession = await Session.findOne({ userId: user._id });
    let oldSessionID = null;
    console.log(existingSession);

    if (existingSession) {
      oldSessionID = existingSession._id;
    }

    
    const newSessionID = req.sessionID;
    console.log('Login Id:', newSessionID);

    
    const newSession = new Session({
      _id: newSessionID,
      userId: user._id,
      session: req.session,
      expires: new Date(Date.now() + 3600000), 
    });

    try {
      await newSession.save();
      console.log(`Successfully saved new session: ${newSessionID}`);
    } catch (saveError) {
      console.error(`Error saving new session: ${newSessionID}`, saveError);
    }

    
    req.session.user = {
      sessionID: newSessionID,
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    
    res.status(200).json({
      message: "Login successful",
      user,
      token: jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
      sessionID: newSessionID,
      oldSessionID, 
    });

    
    if(oldSessionID){
      console.log("Old Session ID to be deleted: ", oldSessionID);
      
    }

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const logoutUser = async (req, res) => {
  try {
    const { sessionID } = req.body;
    console.log(sessionID);

    if (!sessionID) {
      
      res.clearCookie("connect.sid");
      return res.status(400).json({ message: "Session ID is required" });
    }

    const logoutResult = await forceLogoutSession(sessionID);

    res.clearCookie("connect.sid"); 

    if (logoutResult) {
      res.status(200).json({ message: `Session ${sessionID} force-logged out.` });
    } else {
      res.status(403).json({ message: `Session ${sessionID} not found.` });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const checkSession = async (req,res) => {
  try {
    const {userId}=req.body;
    const existingSession = await Session.findOne({ userId });

    if (existingSession) {
      console.log(`Deleting existing session for user ${userId}: ${existingSession._id}`);
      await Session.deleteOne({ _id: existingSession._id });

      return existingSession._id; 
    }

    return null;
  } catch (error) {
    console.error("Error checking active session:", error);
    return null;
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

module.exports = {  loginUser, forgotPassword, sendMailTo,logoutUser,checkSession};
