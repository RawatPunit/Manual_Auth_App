const mongoose = require('mongoose');

const likeSchema =  new mongoose.Schema({
    user:{
        type : mongoose.Schema.ObjectId
    },
    //this define the object id if the liked object
    likeable : {        //thing or object that is been liked
        type : mongoose.Schema.ObjectId,
        require : true,
        refPath : 'onModel'
    },
    // this field is used for defining the type of the liked object since this is a dynamic referenc
    //onModel used
    onModel:{
        type : String,
        required : true,
        enum : ['Post','Comment']           //this models folder has "Post" and "COmments" so like feature in both of em
    }
},{
    timestamps : true
});


const Like = mongoose.model('Like',likeSchema);
module.exports = Like;