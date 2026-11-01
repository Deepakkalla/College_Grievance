const express = require("express")
const {CreateGriveance, getMyGriveance, getGrievanceById, assignGrievance, getAssignedGrievance, updateStatus} = require("../controller/griveanceController")
const {protect, Authrioze} = require("../controller/authController")


const GriveanceRoutes = express.Router()

GriveanceRoutes.post("/creategriveance",protect,CreateGriveance)
GriveanceRoutes.get("/my",protect,getMyGriveance)
GriveanceRoutes.get("/:id",protect,getGrievanceById)
GriveanceRoutes.post("/:id/assign",protect,Authrioze("admin"),assignGrievance)
GriveanceRoutes.get("/assigned",protect,Authrioze("officer"),getAssignedGrievance)
GriveanceRoutes.patch(":id/status",protect,Authrioze("officer","admin",updateStatus))



module.exports = GriveanceRoutes