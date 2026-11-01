const express = require("express")
const { protect } = require("../controller/authController")
const { addComment, getComment } = require("../controller/commentController")

const CommentRoutes = express.Router({mergeParams:true})  // merge params is uses to use parent params becuse in thins we did not use /:id/comment we only use / so params in the parent so we have to use merge params 

CommentRoutes.post("/",protect,addComment)
CommentRoutes.get("/",protect,getComment)

module.exports = CommentRoutes

