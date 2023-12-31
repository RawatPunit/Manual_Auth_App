//creating the schema we need mongoose so call it
const mongoose =  require('mongoose');
const multer = require('multer');
const path = require('path') //path to store the file
const AVATAR_PATH = path.join('/uploads/users/avatars');  //place to upload avatars

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique : true
    },
    password  : { 
        type  : String,
        required :  true
    },
    name:{
        type : String,
        required : true
    },
    avatar : {
        type : String
    }
},{
    //for created at and updated at 
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

//static function --> overall function to everyone not for specific profile
userSchema.statics.uploadAvatar = multer({storage : storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);

module.exports = User;