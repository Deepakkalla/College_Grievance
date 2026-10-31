const express = require("express")
const  {createDepartment,getDepartment} = require("../controller/departmentController")
const {protect ,Authrioze} = require("../controller/authController")

const departmentRoutes = express.Router()

departmentRoutes.post("/createDepartment", protect ,Authrioze("Admin"),createDepartment)
departmentRoutes.get("/getDepartment",protect,getDepartment)

module.exports = departmentRoutes