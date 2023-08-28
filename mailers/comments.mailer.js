const nodemailer = require('../config/nodemailer');
// create function that wills end a mail
//another way of exporting a method like module.export
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment : comment},'/comments/new_comment.ejs');




    nodeMailer.transporter.sendMail({
        from : 'rawatpunit928@gmail.com',
        to : comment.user.email,
        subject  : "New Commnet Published",
        // html : <h1>YUp, Your comment is published</h1>
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        // console.log('Message sent',info);
        return; 
    })
}