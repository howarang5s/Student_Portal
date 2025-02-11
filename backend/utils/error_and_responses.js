const express = require('express');

const server_Error = {
    email_verification_error: "Invalid email format",
    password_verification_error: "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
    email_already_error: "Email Already Exists",
    name_format_error: "Invalid name format",
    server_error: "Server Error",
    user_not_found: "User not found",
    credentials_error: "Invalid Credentials",
    student_not_found: "Contact administration to confirm because you are not added by any teacher",
    permission_denied: "Permission denied. Only teachers can add students.",
    existing_user: "No user found with this email. Please register the student first.",
    teacher_not_found: "Teacher not found",
    student_associated: "You can only deal with students you are associated with.",
    student_not_exist: "No students found for this teacher",
    permission_to_update: "Permission denied. Only teachers can update students.",
    permission_to_delete: "Permission denied. Only teachers can delete students.",
    permission_to_update_teacher_profile: "Permission denied. Only teachers can update their profile.",
    name_and_email_req: "Name and Email are required fields.",
    student_existence: "Student not found",
    header_error: "Authorization header is missing or invalid",
    token_missing: "Token is missing, authorization denied",
    token_expired: "Token is invalid or expired",
    new_password_error: "User found. Please enter a new password.",
    authenticate_error: "Failed to authenticate token"
};

const response_Error = {
    register_success: "User successfully registered. Check your email to verify your account.",
    login_success: "Login successful",
    forget_password_success: "Password updated successfully!",
    student_added: "Student added successfully",
    update_student: "Student profile updated successfully",
    delete_student: "Student deleted successfully",
    teacher_update: "Profile updated successfully",
};

// Use this method to ensure the object is correctly exported
module.exports = {
    server_Error,
    response_Error
};

