const Kid = require("../models/Kid.model");
const location = require("../models/location.model");

module.exports = {
    Addlocation: async (req, res) => {
        const kid = await Kid.findById({ _id: req.params.id })
        await Location.init()
        location = new Location({
            Name: kid.name,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        })
        try {
            const newlocation = location.save()
            res.status(200).send(newlocation)
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
};