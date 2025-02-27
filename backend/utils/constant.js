const express = require('express');

const SERVER_ERROR = {
    EMAIL_VERIFICATION_ERROR: "Invalid email format",
    PASSWORD_VERIFCIATION_ERROR: "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
    EMAIL_ALREADY_ERROR: "Email Already Exists",
    NAME_FORMAT_ERROR: "Invalid name format",
    SERVER_ERR: "Server Error",
    USER_NOT_FOUND: "User not found",
    CREDENTIALS: "Invalid Credentials",
    STUDENTS_NOT_FOUND: "Contact administration to confirm because you are not added by any teacher",
    PERMISSION_DENIED: "Permission denied. Only teachers can add students.",
    EXISTING: "No user found with this email. Please register the student first.",
    TEACHER_NOT_FOUND: "Teacher not found",
    STUDENTS_ASSOCIATED: "You can only deal with students you are associated with.",
    STUDENTS_NOT_EXIST: "No students found for this teacher",
    PERMISSION_DENIED_TO_UPDATE: "Permission denied. Only teachers can update students.",
    PERMISSION_DENIED_TO_DELETE: "Permission denied. Only teachers can delete students.",
    PERMISSION_DENIED_TO_UPDATE_TEACHER_PROFILE: "Permission denied. Only teachers can update their profile.",
    NAME_AND_EMAIL: "Name and Email are required fields.",
    STUDENTS_EXISTENCE: "Student not found",
    HEADER_ERROR: "Authorization header is missing or invalid",
    TOKEN_MISSING: "Token is missing, authorization denied",
    TOKEN_EXPIRED: "Token is invalid or expired",
    NEW_PASSWORD_ERROR: "User found. Please enter a new password.",
    AUTHENTICATE: "Failed to authenticate token",
    OTP_EXPIRED: "OTP has expired.",
    INAVLID_OTP: "Invalid OTP."
};

const RESPONSE_ERROR = {
    REGISTERATION_SUCCESS: "User successfully registered. Check your email to verify your account.",
    LOGIN_SUCCESS: "Login successful",
    FORGOT_PASSWORD_UPDATE: "Password updated successfully!",
    STUDENTS_ADDED: "Student added successfully",
    UPDATE_STUDENT: "Student profile updated successfully",
    DELETE: "Student deleted successfully",
    TEACHER_UPDATE: "Profile updated successfully",
    OTP_VERIFY: "OTP verified successfully! You can now reset your password."
    
};


module.exports = {
    SERVER_ERROR,
    RESPONSE_ERROR
};

