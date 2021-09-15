const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const demoSchema = new Schema({
  email:{
    type:String,
    required:true,
  },
  csvFileData :{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Demo',demoSchema);