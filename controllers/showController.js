const File =require("./../models/fileModel");
const pug = require('pug');
require('dotenv').config();

exports.downloadPage = async (req , res, next) =>{
  try{
    const file = await File.findOne({ uuid : req.params.uuid });
    if(!file){
      return res.render('download' , { error : 'link has been expired! '})
    }

    res.status(200).render('download' , {
      fileName : file.filename , 
      fileSize : file.size ,
      uuid : file.uuid , 
      downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    });

  } catch(err){
    res.status(400).render('download' , {
      error : 'something went wrong!'
    })
  }

}