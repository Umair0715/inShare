const router = require('express').Router();

router.get('/' , (req , res ) =>{
  res.render('home' , {
    status : 'success' ,
    title : 'InShare File Sharing'
  })
})

module.exports = router;