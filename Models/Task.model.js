const mongoose=require('mongoose');

const TaskSchema=new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Description:{
        type: String,
        required:true,
    },
   /* Category: {
      type: String  
    },
    Date:{
       type: Date, default: Date.now
        
    },
    Time: {
         type: Number
    },
    Isfinished: {
        type: Number,
        default:0
    },*/
    Status:{ type: String,default:"doing"},
    kid: { type: mongoose.SchemaTypes.ObjectId, ref: 'Kid' }
});
module.exports=mongoose.model('Task',TaskSchema)