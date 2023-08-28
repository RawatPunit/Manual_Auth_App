const like = require('../models/like');
const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require('../models/like');

module.exports.toggleLike = async function(req,res){
    try{
        //likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;  //for counrt +1 or -1 if I like or not 
        if(req.query.type ==  'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes')
        }


        //check if a like aleady exist
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user._id  //authentication as user cant like with/Out authentication
        })

        //if a like already exist
        if(existingLike){
            //first pullout the like and delete the likeable
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            //make a new like
            let newLike = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel  : req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.json(200,{
            message : "Request Successful",
            data : {
                deleted :deleted
            }
        })



    }catch(err){
        console.log(err);
        return res.json(500,{
            message : "Internl Server Error"
        });
    }
}