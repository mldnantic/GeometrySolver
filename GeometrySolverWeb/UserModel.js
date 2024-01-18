const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:String,
  myProjects:Array
},{ versionKey: false });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;