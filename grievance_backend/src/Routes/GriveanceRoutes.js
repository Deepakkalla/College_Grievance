const express = require("express")
const {CreateGriveance, getMyGriveance, getGrievanceById, assignGrievance} = require("../controller/griveanceController")
const {protect, Authrioze} = require("../controller/authController")


const GriveanceRoutes = express.Router()

GriveanceRoutes.post("/creategriveance",protect,CreateGriveance)
GriveanceRoutes.get("/my",protect,getMyGriveance)
GriveanceRoutes.get("/:id",protect,getGrievanceById)
GriveanceRoutes.post("/:id/assign",protect,Authrioze("admin"),assignGrievance)


module.exports = GriveanceRoutes