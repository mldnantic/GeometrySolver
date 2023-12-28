const mongoose = require('mongoose');

const figureSchema = new mongoose.Schema({
  a:Number,
  b:Number,
  h:Number,
  figura:String,
  username:String
},{ versionKey: false });

const FigureModel = mongoose.model("figure", figureSchema);

module.exports = FigureModel;