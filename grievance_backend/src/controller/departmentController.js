const Department = require("../models/Department");

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "" });
    }
    const department = await Department.create({
      name: name,
      description: description,
    });

    res.status(201).json({
      name: department.name,
      description: department.description,
    });
  } catch (error) {
    res.status(500).json({ message: "" });
  }
};

const getDepartment  = async(req,res)=>{
    try{

        const departments = await Department.find().sort({name:1})
        res.status(200).json(departments)
    }
    catch(error){
        res.json({message:error.message})
    }
}

module.exports = {createDepartment,getDepartment}
