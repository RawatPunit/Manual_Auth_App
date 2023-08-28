const Post = require('../../../models/post');  //findinf from the post schema therfore importing
const Comment = require('../../../models/comment')
module.exports.index = async function(req,res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({                                     //whole code or js file this controller action is ready 
        path : 'comments',
        populate:{
            path : 'user'
        }
    });
    return res.json(200,{
        message : "List of posts",
        posts : posts           //this post retrieves the data from the post schema (all the data in the formof array)                                     
    })
}

module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id)
        
        if(post.user == req.user.id){
            post.remove();
            
            await Comment.deleteMany({post :req.params.id});

          

            return res.json(200, {
                message : "Post And associated comments deleted succesfull"
            });
        }else{
            return res.json(401,{
                message : "You cannot delete this post "
            });
        }
    }catch(err){
      //  req.flash('error',err);  no use since it is an API call
        return res.json(500,{
            message : "Internal Server Error"
        })
    }
}