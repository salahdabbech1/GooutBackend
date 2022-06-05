const mongoose=require('mongoose');

const ParentSchema=new mongoose.Schema({
    Name:{
        type: String,
       
    },
    
    Email:{
        type: String,
        
        unique: true,
        lowercase: true,
        trim: true,
       //match: /.+\@.+\..+/
    },
    Password:{
        type: String,
        
    },
    Picture:{
        type: String,
        default : null,
    },
    Kids:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Kid',
    }],
    Role: 
        {
            type: String,
            default:"parent",
        }
      
    

});
module.exports=mongoose.model('Parent',ParentSchema)