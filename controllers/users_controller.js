const User  =  require('../models/user')
const fs = require('fs');
const path = require('path');


module.exports.profile =  function(req,res){
    User.findById(req.params.id,function(err,user){    
    if(req.cookies.user_id){
        User.findOne(req.cookie.user_id, function(err,user){
            if(user){
                return res.render('user-profile',{
                    title : "User Profile",
                    profile_user: user
                })
            }
            return res.redirect('/user/sign-in')
        })
    }else{
        return  res.redirect('/users/sign-in')
    }
    //controller si ready to be accessed by the router and
    // the router is ready to be accesed by the browser
    // res.end('<h1> User Profile</h1>');          
    // return res.render('user_profile',{
    //     title : 'User Profile'
    //     profile_user : user
    // });
    });
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     //req.body has everything like name and email
    //     User.findByIdAndUpdate(req.params.id, req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send("Unauthorized");
    // }
    if(req.user.id == req.params.id){
        try{
            
            let user = await User.findById(req.params.id) //1.find the user and update the user
            User.uploadedAvatar(req,res,function(err){
                if(err){ console.log('***Multer Error: ',err)}
                // console.log(req.file); was just to check the working wheter it is taking upload file or not
                user.name = req.body.name;
                user.email =  req.body.email;
                //checking whether user is uploading the file or not 
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }
                    //this is saving the path of the uploaded file into the avatar filed in the user
                    user.avatar  = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            }) 
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign Up page
module.exports.signUp = function(req,res){
    //this loop restrictes to sign up if user is already logged in
    if(req.isAuthenticated()){
       return res.render('/users/profile');
    }
    return res.render('user_sign_up',{
        title : "Codiel | Sign Up "
    })
}
// render the sign in page
module.exports.signIn = function(req,res){
    //this loop restrictes to sign in  if user is already logged in
    if(req.isAuthenticated()){
        res.render('/users/profile');
    }
    return res.render('user_sign_in',{
        title : "Codiel | Sign In "
    })
}

//get the sign up data
module.exports.create = function(req,res){
    //check whether 
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding user in Signing Up'); return }
    
        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log('error in finding user in Signing Up'); return }
 
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}


//sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged In successfully');
    //steps to create
    //find the user 
    User.findOne({email: req.body.email}, function(err,user){
        if(err){console.log('error in finding user in Signing In'); return }
         //handle user  found
         if(user){
                //handle passworrd which dont mtach
                if(user.password != req.body.password){
                    return res.redirect('back');
                }
                //handle session creation
                res.cookie('user_id', user.id);
                return res.redirect('/users/profile');
         }else{
         //handle user not found
        
            return res.redirect('back');
        }
    })
}


module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('Success','You have beenlogged out');
    
    return res.redirect('/');
}