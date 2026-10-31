const Jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/GenerateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All field are required" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      res.status(409).json({ message: "Email already used " });
    }
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "email or pasword missinng" });
    }
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(400).json({ message: "email or pasword missinng" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const protect = async (req,res,next)=>{
    try{
        let token 
        if(req.headers.authorization?.startsWith("Bearer ")){
            token = req.headers.authorization.split(" ")[1]
        }
        else{
            res.status(401).json({message:"you are not authroized"})
        }
        const {id} = Jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(!user){
            return res.status(401).json({message:"log in again "})

        }
        req.user = user;
        next()
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}

const Authrioze = (...roles) =>(req,res,next)=>{
  if( !roles.includes(req.user?.role)){
    console.log(req.user.role)
    return res.status(403).json({message:"access denied"})
  }
  next()
}
const profile = (req,res)=>{
  try{
    const User = req.user

    res.json({
       User


    })
  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}


module.exports = { register, Login,protect,profile,Authrioze };
