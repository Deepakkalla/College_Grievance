const Griveance = require("../models/Grievance");

const User = require("../models/User")
const Department = require("../models/Department");
const Grievance = require("../models/Grievance");
const Anonyomous = require("../utils/Anonyomous");
const { options } = require("../Routes/AuthRoutes");

const CreateGriveance = async (req, res) => {
  try {
    let { title, description, category, department, priority, isAnonymous } =
      req.body;
    if (!title || !description || !category || !department || !priority) {
      console.log(
        title,
        description,
        category,
        department,
        priority,
        isAnonymous,
      );
      return res.status(400).json({ message: "Enter  required field " });
    }
    const departementExist = await Department.find({ name: department });
    console.log(departementExist);
    if (!departementExist) {
      return res.status(400).json({ message: "depatemnt did not dfound " });
    }
    department = departementExist._id; // when we declare any field type ref object id it has to be id of another model
    const griveance = await Griveance.create({
      title,
      description,
      category,
      department,
      priority,
      isAnonymous: isAnonymous || false,
      createdBy: req.user._id,
    });
    res.status(201).json(griveance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyGriveance = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const filter = { createdBy: req.user._id };

    if (status) filter.status = status;
    if (category) filter.status = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // its means in title it doesnot match for string it match for a pattern because we wrote $regex
        { ticketId: { $regex: search, $options: "i" } },
      ];
    }
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const griveance = await Griveance.find(filter)
      .populate("department", "name") // there is only field name not Moel reference
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum) // ye query se first 10,20 document skip karke bhej ta hai
      .limit(limitNum); // ye tay karta  hai ki database se kitne document chaiye

    const totalPages = await Griveance.countDocuments(filter);

    return res.json({
      griveance,
      page: pageNum,
      totalPage: Math.ceil(totalPages / limitNum),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGrievanceById = async (req, res) => {
  try {
    const griveance = await Grievance.findById(req.params.id)
      .populate("department", "name,")
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!griveance) {
      return res.status(404).json({ message: "Grievance did not found" });
    }
    const user = req.user;
    const isOwner = griveance?.createdBy?._id.equals(user._id); //for matching object id === did not work so we use .equals if we want to use === if have to convert object id .toString then check===
    const isAssignedOffcer =
      griveance.assignedTo && griveance.assignedTo._id.equals(user._id);
    const isAdmin = user.role == "admin";

    if (!isOwner && !isAssignedOffcer && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(griveance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignGrievance = async (req, res) => {

  try{

  const { officer } = req.body;

  if (!officer) return res.status(400).json({ message: "officer id required" });

  const grievance = await Grievance.findById(req.params.id);

  if (!grievance) return res.json({ message: "Grievance not found" });

  const officerExist  = await User.findById(officer)
  if(!officerExist||officerExist.role !== "officer"){
    return res.status(404).json({message:"officer not Found"})

  }
  grievance.assignedTo = officerExist._id
  if(grievance.status==="submitted"){
    grievance.status = "under_review"

  }
 await grievance.save()

 const updated  = await Grievance.findById(grievance._id).populate("department","name").populate("assignedTo","name email") .populate("createdBy","name email")

 res.json(updated)
}
catch(error){
  res.json({message:error.message})
}

};

const getAssignedGrievance = async (req, res) => {
 try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const filter = { assignedTo: req.user._id };

    if (status) filter.status = status;
    if (category) filter.status = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // its means in title it doesnot match for string it match for a pattern because we wrote $regex
        { ticketId: { $regex: search, $options: "i" } },
      ];
    }
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const griveance = await Griveance.find(filter)
      .populate("department", "name") // there is only field name not Moel reference
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum) // ye query se first 10,20 document skip karke bhej ta hai
      .limit(limitNum); // ye tay karta  hai ki database se kitne document chaiye

    const totalPages = await Griveance.countDocuments(filter);

    return res.json({
      griveance:griveance.map((g)=> Anonyomous(g,req.user)), 
      page: pageNum,
      totalPage: Math.ceil(totalPages / limitNum),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req,res)=>{
  try{

    const {status} = req.body
    if(!status){
      return res.json({message:"status not found"})
    }

    const grievance = await Grievance.findById(req.params.id)

    if(!grievance){
      return res.json({message:"grievance not found"})
    }

    const user  = req.user
    const isAssignedofficer = grievance.assignedTo&&grievance.assignedTo.equals(user._id)

    if(!isAssignedofficer||user.role !== "admin"){
      return res.json({message:"access denial"})


    }
    grievance.status = status
    await grievance.save()

    res.json({
      _id:grievance._id,
      ticketId:grievance.ticketId,
      status:grievance.status

    })
  }
  catch(error){
    res.json({messsage:error.message})
  }



}

const getAllGrievance =async (req,res)=>{
  try{
      const {
      status,
      category,
      priority,
      department,
      assignedTo,
      search,
      page = 1,
      limit = 10,
    } = req.query
    const filter = {}
     if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;

    if(assignedTo =="unassigned"){
      filter.assignedTo = null
    }
    else if(assignedTo){
      filter.assignedTo = assignedTo
    }
    if(search){
      filter.$or = [
       { title:{$regex:search ,options:"i" }},
       { ticketId:{$regex:search ,options:"i" }}
      ]
    }
    console.log("hello")
    const pageNum = Math.max(parseInt(page)||1,1)
    const limitNum = Math.min(Math.max(parseInt(limit)||10,1),50)


    console.log("hello 2")
    
    
    const grievance = await Grievance.find(filter).populate("department","name").populate("createdBy","name email").populate("assignedTo","name email").sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum)
    
    const total = await Grievance.countDocuments(filter)
    console.log("hello 3")
    
    res.json({
      grievance,
      page:pageNum,
      totalPages:Math.ceil(total/limitNum),
      total
    })
    console.log("hello 4")

  }
  catch(error){
    res.json({message:error.message})

  }
}





module.exports = { CreateGriveance, getMyGriveance, getGrievanceById, assignGrievance , getAssignedGrievance,updateStatus,getAllGrievance};

