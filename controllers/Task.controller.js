const Parent = require("../models/Parent.model");
const Kid = require("../models/Kid.model");
const Task = require("../models/Task.model");

module.exports = {
    AddTask: async (req, res) => {
        await Task.init();
        console.log(req.body);
        thetask = new Task({
            Title: req.body.Title,
            Description: req.body.Description,
            Category: req.body.Category,
            Date: req.body.Date,
            Time: req.body.Time,
            kid: req.params.id
        })
        const tfol = await Kid.findById({ _id: req.params.id })
        try {
            const newtask = await thetask.save();
            tfol.Tasks.push(thetask)
            tfol.save()
            res.status(201).json(newtask);
        } catch (error) {
            res.status(400).json({ reponse: error.message });
        }
    },
    Gettasks: async (req, res) => {
        try {
            const tasks = await Task.find({ kid: req.params.id })

            res.json(tasks)
      
        } catch (error) {
            res.status(500).json(error)
        }

    }
}