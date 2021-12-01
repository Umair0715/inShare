const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const cors = require('cors');
const path = require('path');
const app = express();

dotenv.config();

//middlewares
app.use(express.static('public'));
app.use(express.json());

const corsOptions = {
  origin : process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));
//template engine
app.set('view engine' , 'pug');
app.set('views' , path.join(__dirname , 'views'));

//routes
app.use('/api/files' , require('./routes/fileRoute'));
app.use('/files' , require('./routes/showRoute'));
app.use('/files/download' , require('./routes/downloadRoute'));
app.use('/' , require('./routes/homeRoute'));

connectDB();
const PORT = process.env.PORT;
app.listen(PORT , err =>{
  if(err){
   return console.log(err)
  }
  console.log(`server is listening on port ${PORT}`);
});

