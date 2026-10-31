const mongoose = require("mongoose")


const CommentSchema = new mongoose.Schema({

    griveance:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Grievance",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        require:true,
        trim:true,
        maxlength:100
    }
},{
    timestamps:true
})

CommentSchema.index({grievance:1,createdAt:1})


module.exports = mongoose.model("Comment",CommentSchema)