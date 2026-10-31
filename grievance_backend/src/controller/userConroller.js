const User  = require("../models/User")
const Department  = require("../models/Department")

const createOfficer = async (req,res)=>{
    try{

    
     const { name, email, password, department } = req.body;
     if(!name||!email||!password||!department){
        return res.json({message:"all field are required"})

     }
     const departmentExist = await Department.findById(department)
     if(!departmentExist){
        return res.json({message:"department not found"})

     }
     const userExist = await User.findOne({email:email})

     if(userExist){
        return res.json({message:"email is already registerd "})


     }
     const user  = await User.create({
        name,
        email,
        password,
        role:"officer",
        department
     })

     res.status(201).json({
        id:user._id,
        email:user.email,
        role:user.role,
        department:user.department
     })
    }
    catch(error){
        res.status(500).json({message:error.message})
    }


}

const getUsers = async (req,res)=>{

    try{    
    const {role,department} = req.query
    const filter = {}
    if(role) filter.role = role
    if(department) filter.department = department

    const users = await User.find(filter).populate("department","name").sort({createdAt:-1})


    res.json(users)
    }
    
    catch(error){
        res.status(500).json({message:error.message})
    }




}


module.exports = {createOfficer , getUsers}