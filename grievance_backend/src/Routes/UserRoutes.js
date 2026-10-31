const express = require("express")
const { createOfficer, getUsers } = require("../controller/userConroller")
const { protect, Authrioze } = require("../controller/authController")

const userRouter = express.Router()

userRouter.post("/officer",protect,Authrioze("admin"),createOfficer)
userRouter.get("/getUsers",protect,Authrioze("admin"),getUsers)


module.exports = userRouter