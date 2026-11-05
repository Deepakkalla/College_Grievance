const express = require("express")
const{protect,Authrioze} = require("../controller/authController")
const {getSummary} = require("../controller/analyticsController")

const analyticsRoutes = express.Router()

analyticsRoutes.get("/summary",protect,Authrioze("admin"),getSummary)

module.exports = {analyticsRoutes}
