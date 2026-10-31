const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true // trim true means it automatically remove extra whitw space from end and beginning
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true

    },
    password:{
        type:String,
        required:true,
        minlength:6

    },
    role:{
        type:String,
        enum:["student" , "officer","admin"],
        default:"student"
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
    }
    
},
{timestamps:true}

);

UserSchema.pre('save',async function(next){
    const user  = this // in this line this is a key worf whch refer to a document in colllection which we are using now thats why schema method onle works in normal function not in arrow function 
    if(!user.isModified("password")){ 
        return  //next()
    }
    
    user.password = await bcrypt.hash(user.password,10)
    // next(); // in new mongoose no new is required 

})

// in this hum async and await use kr sakte the lekin hum ne nhi kiya  kyu ki  bcryt.compare ek pomise return karta hai or jb hum isko use kre ge toh await ke sath use krege to promise resove ho kar hi value aayegi agar async await use kare ge tb bhi galat nhi h 
UserSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)

}


module.exports = mongoose.model("User",UserSchema)