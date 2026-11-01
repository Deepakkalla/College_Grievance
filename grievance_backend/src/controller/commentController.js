const Comment = require("../models/Comment")
const Grievance  = require("../models/Grievance")
const {formatComment,canAccess} =  require("../utils/CommentHelper")

const addComment = async (req,res)=>{
    try{

    
    const {message} = req.body
    if(!message||!message.trim()){
        return res.json({message:"message is required"})

    }
    const grieveance  = await Grievance.findById(req.params.grievanceId)
    if(!grieveance){
        return res.json({message:"grievance not found "})

    }
    if(!canAccess(grieveance,req.user)){
        return res.json({message:"access denied "})

    }
    if(["resolved","rejected"].includes(grieveance.status)){
        return res.status(400).json({message:"This grievance is closed "})

    }
    let comment = await Comment.create({
        griveance:grieveance._id,
        user:req.user._id,
        message:message
    })
    console.log("1",comment)
    comment = await Comment.findById(comment._id)
    console.log(2,comment)

    // there is an issue in which we cant directly populate when we create a document so we have to fetch them then we can populate 

    await comment.populate("user","name role") // we have to send comment annd there user deatil so we attach there detail in comment so that e can send 

    res.status(201).json(comment)

}
catch(error){
    res.status(500).json({message:error.message})
}

}

const getComment = async (req,res)=>{
    try{

    
    const grievance = await Grievance.findById(req.params.grievanceId)

    if(!grievance){
        return res.json({message:"grievance not found"})

    }
    if(!canAccess(grievance,req,user)){
        return res.json({message:"access denied"})

    }
    const comments = Comment.find({grivance:grievance._id}).populate("user","name role").sort({createdAt:-1})

    res.json(
        comments.map((c)=>formatComment(c,grievance,req.user))
    )
}
catch(error){
    res.status(500).json({message:error.message})
}


}

module.exports = {getComment,addComment}