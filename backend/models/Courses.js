const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const coursesSchema = new mongoose.Schema({
  courseId: { type: Number, unique: true },
  courseName: { type: String, required: true }
},{ timestamps: true });

coursesSchema.plugin(AutoIncrement, { inc_field: "courseId" });

const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
