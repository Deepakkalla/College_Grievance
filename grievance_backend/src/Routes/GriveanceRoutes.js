const express = require("express")
const {CreateGriveance, getMyGriveance, getGrievanceById} = require("../controller/griveanceController")
const {protect} = require("../controller/authController")


const GriveanceRoutes = express.Router()

GriveanceRoutes.post("/creategriveance",protect,CreateGriveance)
GriveanceRoutes.get("/my",protect,getMyGriveance)
GriveanceRoutes.get("/:id",protect,getGrievanceById)


module.exports = GriveanceRoutes