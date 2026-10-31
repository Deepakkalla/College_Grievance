const mongoose = require("mongoose")

const connect = async()=>{
    try{
        const conn = await mongoose.connect(process.env.URI,{
            dbName:"GRIRVANCE_DB"
        })
        console.log("MongoDB connection established ", conn.connection.host)

    }
    catch(err){
        console.log("Mongodb connection faild",err.message)

    }
}

module.exports = connect