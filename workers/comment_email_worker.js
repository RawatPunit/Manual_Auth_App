const queue = require('../config/kue');
//call the comment mailer as we need teh comments
const commentsMailer = require('../mailers/comments_mailer');

//queue code runner -- a new task comes inside the queue this code runs
queue.process('emails',function(job,done){
    console.log("emails worker is processing the job", job.data)  //job.data holds teh data that is coming in 

    commentsMailer.newComment(job.data);
    done(); 
})