const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  _id: String,  
  userId: { type: String, required: true },  
  session: Object,
  expires: Date,
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
