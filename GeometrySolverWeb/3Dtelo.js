const mongoose = require('mongoose');

const rotTeloSchema = new mongoose.Schema({
  naziv:String,
  P:Number,
  V:Number,
  nizFigura:Array,
  uID:String
},{ versionKey: false });

const rotTeloModel = mongoose.model("figure", rotTeloSchema);

module.exports = rotTeloModel;