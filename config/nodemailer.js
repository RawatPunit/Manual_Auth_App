const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

let transporter = nodemailer.createTransport(env.smtp);


//this section sends the mail-----------------------------------Production Mode thus COmmented
// let transporter  = nodemailer.createTransport({
//     service : 'gmail',
//     host: 'smtp.google.com',
//     port : 587,
//     secure : false,
//     auth :{
//         user : 'alchemy.cn18',
//         pass : 'Punnu'
//     }
// });

//defines whwnever i send an HTML file placed inside view/mailer
let rendertemplate = (data, relativepath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){console.log('error in rendering template',err); return}

            mailHTML = template;
        }
    )
    return  mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}