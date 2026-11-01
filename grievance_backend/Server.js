const dotenv = require("dotenv")
const connect  = require("./src/config/DB")
const express = require("express")
const cors = require("cors")
const AuthRoutes = require("./src/Routes/AuthRoutes")
const departmentRoutes = require("./src/Routes/DepartmenRoutes")
const GriveanceRoutes = require("./src/Routes/GriveanceRoutes")
const userRouter = require("./src/Routes/UserRoutes")
const CommentRoutes = require("./src/Routes/CommentRoutes")
const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())


app.use("/test",(req,res)=>{
    res.send("test page is running")

})

app.use("/api/auth",AuthRoutes)
app.use("/api/Department",departmentRoutes)
app.use("/api/grievances/:grievanceId/comments",CommentRoutes)
app.use("/api/grievances",GriveanceRoutes)
app.use("/api/users",userRouter)


connect()
.then(()=>{
    app.listen(3000,()=>{
    console.log("server is started")
})
})


