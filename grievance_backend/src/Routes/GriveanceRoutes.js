const express = require("express")
const {CreateGriveance, getMyGriveance, getGrievanceById, assignGrievance, getAssignedGrievance, updateStatus, getAllGrievance} = require("../controller/griveanceController")
const {protect, Authrioze} = require("../controller/authController")
const Grievance = require("../models/Grievance")

const upload =   require("../utils/MulterUpload")


const GriveanceRoutes = express.Router()

GriveanceRoutes.post("/creategriveance",protect,upload.array("attachment",3),CreateGriveance)
GriveanceRoutes.get("/my",protect,getMyGriveance)
GriveanceRoutes.get("/:id",protect,getGrievanceById)
GriveanceRoutes.post("/:id/assign",protect,Authrioze("admin"),assignGrievance)
GriveanceRoutes.get("/assigned",protect,Authrioze("officer"),getAssignedGrievance)
GriveanceRoutes.patch(":id/status",protect,Authrioze("officer","admin",updateStatus))
GriveanceRoutes.get("/",protect,Authrioze("admin"),getAllGrievance)





module.exports = GriveanceRoutes