const nodemailer = require('nodemailer');
require('dotenv').config();
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(from , to , file){
    this.from = from ;
    this.to = to ;
    this.file = file;
  }

  newTransport(){
    return nodemailer.createTransport({
      host : process.env.EMAIL_HOST,
      port : process.env.EMAIL_PORT,
      auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
      }
    })
  }

 async mailSender(template , subject){
     const html = pug.renderFile(`${__dirname}/../views/${template}.pug` , {
       emailFrom : this.from ,
       emailTo : this.to,
       size : parseInt(this.file.size / 1000 ) + 'KB' ,
       expires : '24 Hours' ,
       downloadLink : `${process.env.APP_BASE_URL}/files/${this.file.uuid}`
     })

     const mailOptions = {
       from : this.from ,
       to : this.to ,
       subject ,
       html ,
       text : htmlToText.fromString(html)
     }
     
     await this.newTransport().sendMail(mailOptions);

  }

  async sendDownloadMail(){
   await this.mailSender('downloadEmail', 'inShare File Sharing');
  }


}