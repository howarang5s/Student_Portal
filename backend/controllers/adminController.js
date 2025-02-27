
const Course = require('../models/Courses');
const Student = require('../models/Studentmodel');
const User = require('../models/Usermodel'); 
const {SERVER_ERROR,RESPONSE_ERROR} = require('../utils/constant');

const addStudent = async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
  }

  let { name, email, password, subjects } = req.body;

  const courses = await Course.find();
  const courseIds = []; 
  
  subjects.forEach((courseName) => { 
    courses.forEach((course) => {
      if (course.courseName === courseName) {
        courseIds.push(course.courseId); 
      }
    });
  });
  let courseId = []
  courseIds.forEach((course) => {
    courseId.push(course.toString());
  });
  
  


  try {
    
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
    }

    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: SERVER_ERROR.PASSWORD_VERIFICATION_ERROR });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const newUser = new User({
      name,
      email,
      password,
      role: 'student',
      subjects:courseId,  
      emailToken: null,
      isVerifiedEmail: false
    });
    

    await newUser.save();

    res.status(201).json({ message: RESPONSE_ERROR.STUDENTS_ADDED, user: newUser });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
  }
};


const addTeacher = async (req, res) => {
 
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
  
    let { name,email,password,subjects } = req.body;
    const courses = await Course.find();
    const courseIds = []; 
  
    subjects.forEach((courseName) => { 
      courses.forEach((course) => {
        if (course.courseName === courseName) {
          courseIds.push(course.courseId); 
        }
      });
    });
    let courseId = []
    courseIds.forEach((course) => {
      courseId.push(course.toString());
    });
    
    
  
    try {

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
  
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }  
      const role = 'teacher';
      const emailToken = null;
      
      const newUser = new User({
          name,
          email,
          password,
          role,
          subjects:courseId,
          emailToken,
          isVerifiedEmail: false
      });
      
      await newUser.save();
      
      res.status(201).json({ message: RESPONSE_ERROR.STUDENTS_ADDED, user:newUser });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  const getAllTeachers = async (req, res) => {
    try {
        let { page, limit, sortField, sortOrder } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sortOrder = sortOrder === 'desc' ? -1 : 1;

        const sortCriteria = {};
        if (sortField) {
            sortCriteria[sortField] = sortOrder;
        } else {
            sortCriteria['createdAt'] = -1; 
        }

        

        const teachers = await User.find({ role: 'teacher' })
            .sort(sortCriteria)  
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const courses = await Course.find();

        const enrichedTeacher = teachers.map(teacher => {
          const enrichedSubjects = teacher.subjects.map(subject => {
            
            if (typeof subject === 'number' || !isNaN(subject)) {
              const courseId = Number(subject); 
              const course = courses.find(c => c.courseId === courseId);
              return course ? course.courseName : subject; 
            } else {
              
              return subject;
            }
          });
    
  
          return {
            ...teacher.toObject(),
            subjects: enrichedSubjects,
          };
        });

        const totalTeachers = await User.countDocuments({ role: 'teacher' });

        res.status(200).json({
            enrichedTeacher,
            totalTeachers,
            totalPages: Math.ceil(totalTeachers / limit),
            currentPage: page
        });

    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

  const updateAnyTeacherProfile = async (req, res) => {
    
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
    const { name, email,pass } = req.body;  
    const { teacherId } = req.params; 
    
    
    try {
    
      let user = await User.findById(teacherId);
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }

      
      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(user.name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
    
      
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }
      const courses = await Course.find();
      const courseIds = []; 
      
      req.body.subjects.forEach((courseName) => { 
        courses.forEach((course) => {
          if (course.courseName === courseName) {
            courseIds.push(course.courseId); 
          }
        });
      });
      let courseId = []
      courseIds.forEach((course) => {
        courseId.push(course.toString());
      });
      
      

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email
      user.subjects = courseId || user.subjects;

      
      await user.save();
      
  
      res.status(200).json({ message: RESPONSE_ERROR.UPDATE_STUDENT, user });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  const deleteTeacher = async (req, res) => {
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.permission_to_delete });
    }
  
    const { teacherId } = req.params;
    
    try {

      const user = await User.findById(teacherId);
      
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      
      await user.deleteOne();
      res.status(200).json({ message: RESPONSE_ERROR.DELETE });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
    }
  };
  
  
  const getAllStudents = async (req, res) => {
    try {
        let { page, limit, sortField, sortOrder } = req.query;

        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sortOrder = sortOrder === 'desc' ? -1 : 1; 
        
        const sortCriteria = {};
        if (sortField) {
            sortCriteria[sortField] = sortOrder;
        } else {
            sortCriteria['name'] = 1; 
        }

        const skip = (page - 1) * limit;

        const students = await User.find({ role: 'student' })
            .sort(sortCriteria) 
            .skip(skip)
            .limit(limit)
            .exec();

            const courses = await Course.find();

        
        const enrichedStudents = students.map(student => {
          const enrichedSubjects = student.subjects.map(subject => {
            
            if (typeof subject === 'number' || !isNaN(subject)) {
              const courseId = Number(subject); 
              const course = courses.find(c => c.courseId === courseId);
              return course ? course.courseName : subject; 
            } else {
              
              return subject;
            }
          });
          
        
          return {
            ...student.toObject(),
            subjects: enrichedSubjects,
          };
        });
        
        const totalStudents = await User.countDocuments({ role: 'student' });

        res.status(200).json({
            enrichedStudents,
            totalStudents,
            totalPages: Math.ceil(totalStudents / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error' });
    }
  };




  const getAllStudentsByadmin = async (req, res) => {
    try {
        
        const students = await Student.find(); 
        if (students.length === 0) {
          return res.status(404).json({ message: SERVER_ERROR.STUDENTS_NOT_EXIST });
        }
  
        return res.status(200).json(students); 
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };
  

  const getAdminProfile = async (req,res) => {
    try{
      const profile = await User.findOne({_id : req.userId });
      if (!profile){
        return res.status(404).json({ message: SERVER_ERROR.TEACHER_NOT_FOUND });
      }
      return res.status(200).json(profile)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }
  
  const getStudentbyId = async (req,res) => {
    const { studentId } = req.params; 
    try{
      
      const user = await User.findById(studentId);
  
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      
      return res.status(200).json(user)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }

  const getTeacherbyId = async (req,res) => {
    const { teacherId } = req.params; 
    try{
      
      const teacher = await User.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      return res.status(200).json(teacher)
    }catch{
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  }

  const updateAdminProfile = async (req, res) => {
    
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED_TO_UPDATE_TEACHER_PROFILE });
    }
  
    const { name, email } = req.body;  
    const { adminId } = req.params;
  
    
    if (!name || !email) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_AND_EMAIL });
    }
  
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
    }
  
    
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
    }
  
    try {
      
      const admin = await User.findById(adminId);
  
      if (!admin) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      
      admin.name = req.body.name || admin.email;
      admin.email = req.body.email || admin.email;
      await admin.save();
  
      res.status(200).json({ message: RESPONSE_ERROR.TEACHER_UPDATE, admin });
    } catch (error) {
      
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };

  
  const updateAnyStudentProfile = async (req, res) => {
    
    if (req.userRole!=='admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
    const { name, email,pass } = req.body;  
    const { studentId } = req.params; 
    
    
    try {
      const user = await User.findById(studentId);
      
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
      
      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(user.name)) {
        return res.status(400).json({ message: SERVER_ERROR.NAME_FORMAT_ERROR });
      }
      
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: SERVER_ERROR.EMAIL_VERIFICATION_ERROR });
      }

      const courses = await Course.find();
      const courseIds = []; 
      
      req.body.subjects.forEach((courseName) => { 
        courses.forEach((course) => {
          if (course.courseName === courseName) {
            courseIds.push(course.courseId); 
          }
        });
      });
      let courseId = []
      courseIds.forEach((course) => {
        courseId.push(course.toString());
      });
      
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.subjects = courseId || user.subjects;
  
      await user.save();
  
      res.status(200).json({ message: RESPONSE_ERROR.UPDATE_STUDENT, user });
    } catch (error) {
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR });
    }
  };
  
  
  const deleteStudent = async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: SERVER_ERROR.PERMISSION_DENIED });
    }
    const { name, email,pass } = req.body;  
    const { studentId } = req.params;
  
    try {
      const user = await User.findById(studentId);
  
      if (!user) {
        return res.status(404).json({ message: SERVER_ERROR.STUDENTS_EXISTENCE });
      }
  
      const student = await Student.findOne({userId:studentId});
      
      if (student) {
        await student.deleteOne({userId:studentId});
      }
      
      await user.deleteOne();
      res.status(200).json({ message: RESPONSE_ERROR.DELETE });
    } catch (error) {
      
      res.status(500).json({ message: SERVER_ERROR.SERVER_ERR});
    }
  };


  const addCourse = async (req, res) => {
    const { name } = req.body;
    
    try {
      
      const newCourse = new Course({
        courseName: name
      });

      await newCourse.save();
      
      res.status(201).json({ message: "Course added successfully", course: newCourse });

    } catch (error) {
      console.error("Failed to add course", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
      const course = await Course.findOne({ courseId });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      await course.deleteOne();
      
      res.status(200).json({ message: "Course deleted successfully" });

    } catch (error) {
      console.error("Failed to delete course", error);
      res.status(500).json({ message: "Server error" });
    }
  };
 
  const getAllCourse = async (req,res) => {
    let { page, limit, sortField, sortOrder } = req.query;
    
    if (sortField === 'name'){
      sortField = 'courseName';
    }
    if (sortField === 'id'){
      sortField = 'courseId';
    }
        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sortOrder = sortOrder === 'desc' ? -1 : 1; 
        
        const sortCriteria = {};
        if (sortField) {
            sortCriteria[sortField] = sortOrder;
        } else {
            sortCriteria['courseId'] = 1; 
        }
        

        const skip = (page - 1) * limit;

        const courses = await Course.find()
            .sort(sortCriteria) 
            .skip(skip)
            .limit(limit)
            .exec();
        
        const totalCourse = await Course.countDocuments();

        res.status(200).json({
            courses,
            totalCourse,
            totalPages: Math.ceil(totalCourse / limit),
            currentPage: page
        });
  }
  
  const editCourse = async (req, res) => {
    const { name } = req.body;
    const { courseId } = req.params;
    

    try {
      const course = await Course.findOne({ courseId });
      

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      course.courseName = name || course.courseName;

      await course.save();

      res.status(200).json({ message: "Course updated successfully", course });

    } catch (error) {
      console.error("Failed to update course", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const getCourses = async(req,res)=> {
    try{
      const courses = await Course.find();
      let coursetoadd = [];
      courses.forEach((course) => {
         coursetoadd.push(course.courseName);
      });
      
      res.status(200).json(coursetoadd);
    }catch(error){
      console.error("Failed to update course", error);
    }
  }

  const getCourseByCourseId= async (req,res) => {
    const { courseId } = req.params;
    
    try{
      const course = await Course.findOne({ courseId });
      

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    }catch(error){
      console.error("Failed to update course", error);
      res.status(500).json({ message: "Server error" });
    }
  }




  module.exports = {
    addTeacher,
    updateAnyTeacherProfile,
    deleteTeacher,
    getAllTeachers,
    getAllStudents,
    getTeacherbyId,
    getStudentbyId,
    getAdminProfile,
    updateAdminProfile,
    addStudent,
    updateAnyStudentProfile,
    deleteStudent,
    getAllStudentsByadmin,
    addCourse,
    editCourse,
    deleteCourse,
    getAllCourse,
    getCourseByCourseId,
    getCourses
    
  };