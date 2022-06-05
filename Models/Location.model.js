const mongoose = require('mongoose')


const LocationSchema = new mongoose.Schema({
    Name:{type:String},
    Longitude: { type: Number },
    Latitude: { type: Number },
});