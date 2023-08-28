const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

//using the user as model for identity establishing of the USer
const User =  require('../models/user');
//encryption - decrypeion of KEY
let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayload,done){
    User.findById(jwtPayload._id, function(err,suer){
        if(err){console.log('Error in finding iuser from JWT'); return ;}

        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }


    })
}));

module.exports = passport;