const express = require('express');
const { authenticate } = require('../middleware/authmiddleware');

const server_Error = {
    email_verification_error:"Invlid email format",
    password_verification_error:"Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
    email_already_error:"Email Already Exist",
    name_format_error:"Invalid name format",
    server_error:"Server Error",
    user_notfound:"User not found",
    credentials_error:"Invalid Credentials",
    student_not_found:"Contact to administration to confirm becuase you are not added by any teacher",
    permission_denied:"Permission denied. Only teachers can add students.",
    existing_user:"No user found with this email. Please register the student first.",
    teacher_not_found:"Teacher not found",
    student_associated:"You can only deal with students you are associated with.",
    student_not_exist:"No students found for this teacher",    
    permission_to_update:"Permission denied. Only teachers can update students.",
    permission_to_delete:"Permission denied. Only teachers can delete students.",
    permission_to_update_teacher_profile:"Permission denied. Only teachers can update their profile.",
    name_and_email_req: "Name and Email are required fields.",
    student_existence:"Student not found",
    header_error:"Authorization header is missing or invalid",
    token_missing:"Token is missing, authorization denied",
    token_expired:"Token is invalid or expired",
    new_password_error:"User found. Please enter a new password.",
    authenticate_error:"Failed to authenticate token"
}

const response_Error = {
    register_sucess:"User successfully registered. Check your email to verify your account.",
    login_sucess:"Login successful",
    forget_password_sucess:"Password updated successfully!",
    student_added:"Student added successfully",
    update_student:"Student profile updated successfully",
    delete_student:"Student deleted successfully",
    teacher_update:"Profile updated successfully",
    



}

module.exports={
    response_Error,server_Error
}