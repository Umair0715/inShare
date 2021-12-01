const router = require('express').Router();
const File = require('./../models/fileModel');

router.get('/:uuid' ,async (req , res ) =>{
  try{
    const file = await File.findOne({ uuid : req.params.uuid });
    if(!file){
      return res.status(400).render('download' , {error : 'link has been expired! '})
    }
    console.log(file);
    const downloadFile = `${__dirname}/../${file.path}`;
    res.download(downloadFile);

  }catch(error){
    console.log(error)
    res.status(400).render('download'  , {
      error : 'something went wrong!',
    })
  }
})

module.exports = router;