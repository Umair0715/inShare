const mongoose = require("mongoose");
require('dotenv').config();


module.exports = function connectDB () {
  const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

    mongoose.connect(DB , {
      useNewUrlParser : true ,
      useUnifiedTopology : true
    }).then(con =>{
      console.log('Database connected!');
    }).catch(err =>{
      console.log(`Database connnection failed!` , err)
    });

}