const express  = require("express")
const {register,Login, protect, profile}  = require("../controller/authController")

const AuthRoutes = express.Router()

AuthRoutes.post("/register",register)
AuthRoutes.post("/login",Login)
AuthRoutes.get("/profile",protect,profile)




module.exports = AuthRoutes
