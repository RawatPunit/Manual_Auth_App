const passport  =  require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//reuire the user, now need to tell passport to use this local authenticatoin 
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
    },
    //email and password are passed on
    //done is my callback function which is reporting to the passport js
    function(req,email,password,done){
        //find the user an establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
            //    console.log("error in finding the user --> Passport"); 
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password!= password){
                // console.log("Invaldi Username/Password");
                req.flash('error','Invalid Username/Password')
                return done(null,false);
            }
            return done(null,user);
        });
    }
));


//serialisig --> put the user.id into the cookie(which key is to  be kept in the cookie)
passport.serializeUser(function(user,done){
    done(null, user.id);
})
//deserialising --> use the cookie to retrieve the info form the DB
passport.deserializeUser(function(user,done){
    User.findById(id,function(err,user){
        if(err){ console.log("error in finding the user --> Passport"); return done(err);}
        return done(null,user);
    });
});

//check whether user is authenticated 
passport.checkAuthentication =  function(req,res,next){
    //if user is signed in then pass on the reuest to the next function(ie controller ACtion)
    if(req.isAuthenticated()){
        return next;
    }
    //if user is not signed in 
    return res.redirect('/user/sign-in');
}

passport.setAuthenicatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user containcs the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;