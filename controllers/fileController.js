const multer = require("multer");
const File = require('../models/fileModel');
const { v4 : uuid4 } = require('uuid');
const Email = require("./../utils/email");

const storage = multer.diskStorage({
  destination : (req , file , cb) => cb (null , 'uploads/'),
  filename : ( req , file , cb ) => {
    const ext = file.mimetype.split('/')[1];
    cb(null , `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`)
  }
});

const upload = multer({
  storage , 
  limit : {fileSize : 1000000 * 100 }
});

exports.multerUpload = upload.single('myFile');

exports.uploadFile = async(req , res, next) =>{
    // console.log(req.file);
    // 1) validate request 
      if(!req.file){
        return res.status(400).json({
          error : 'All fields are required!'
        })
      }
    // 2) store file
    const newFile = await File.create({
      filename : req.file.filename ,
      path : req.file.path , 
      size : req.file.size , 
      uuid : uuid4() 
    });

    // 4) response 
    res.status(200).json({
     file : `${process.env.APP_BASE_URL}/files/${newFile.uuid}`
    });
};

exports.sendMail =async (req , res ,next) =>{
  const {uuid , emailFrom , emailTo } = req.body;
  if(!uuid || !emailFrom || !emailTo){
    return res.status(422).render('download' , { error : 'All fields are required! '})
  }

  try{
    const file = await File.findOne({ uuid });
    if(!file){
      return res.status(422).render('download' , {
        error : 'link has benn expired!'
      })
    }
    if(file.sender){
      return res.status(400).render('download' , { error : 'Email already send!'})
    }
    
    file.sender = emailFrom ;
    file.receiver = emailTo ;
    
    await file.save();
    await new Email(emailFrom , emailTo , file ).sendDownloadMail();

    res.status(200).json({
      message : `Email Sent to ${emailTo}`,
      status : 200 
    });

  }catch(err){
    return res.status(400).render('download' , {
      error : `something went wrong! ${err}`
    })
  }
};