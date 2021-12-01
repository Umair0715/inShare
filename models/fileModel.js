const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename : {
    type : String , 
    required : [true , 'a File must have a filename']
  },
  path : {
    type : String , 
    required : [true ,'file must have a path!']
  }, 
  uuid : {
    type : String , 
    required : [true, 'file must have uuid!']
  }, 
  size : {
    type : Number , 
    required : [true , 'file must have a fileSize']
  } ,
  sender : {
    type : String , 
    required : false 
  },
  receiver : {
    type : String, 
    required : false 
  }
  
} , {timestamps : true });

const File = mongoose.model('File' , fileSchema);
module.exports = File ;