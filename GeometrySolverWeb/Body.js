const mongoose = require('mongoose');

const BodyModel = new mongoose.Schema({
  projectname:String,
  creatorID:String,
  length:Number, 
  figures:{
    type:[{
      a:Number,
      b:Number,
      h:Number,
      tip:String,
      izvrnuta:Boolean,
      }],
  },
},{ versionKey: false });

const bodyModel = mongoose.model("body", BodyModel);

module.exports = bodyModel;