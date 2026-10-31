const crypto = require("node:crypto")

const GenerateToken = ()=>{
    const date = new Date().toISOString().slice(0,10)
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    console.log("GRV","-",random,date)
    return `GRV-${date}-${random}`
}

module.exports = GenerateToken