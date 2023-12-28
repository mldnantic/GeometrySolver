const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:String,
  myProjects:Array
},{ versionKey: false });

const userModel = mongoose.model("figure", userSchema);

module.exports = userModel;