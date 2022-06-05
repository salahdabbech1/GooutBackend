const Parent = require("../Models/Parent.model");
const Kid = require("../Models/Kid.model");
const Task = require("../Models/Task.model");

module.exports={
Getkids: async(req,res)=>{
    try {const kids = await Kid.find({Myparent:req.params.id})
           res.json(kids)
        
    } catch (error) {
  res.status(500).json(error)}
        }

}

