const mongoose=require('mongoose')
const surveys=new mongoose.Schema({
    title:{
        type:String,
        requied:true
    },
    description:{
        type:String,
        required:true
    },
    questions:[{
        _id:false,
        text:{
            type:String,
            
            required:true
         },
         qType:{
            type:String,
            required:true

         },
         options:[{

            type:String
         }]
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
},{timestamps:true});
module.exports= mongoose.model('survey',surveys)
