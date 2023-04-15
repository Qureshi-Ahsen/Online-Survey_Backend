const mongoose=require('mongoose');

const surveyResponse= new mongoose.Schema({
    surveyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'survey',
        required:true
    },
    
    answers:[{
        _id:false,
       question:{
        type:String,
        
       },
       answer:{
        type:String,
        required:true
       }
    }],
    name:{
         type:String,
         required:true
    },
    email:{
        type:String,
        required:true
    },
},{timestamps:true});

module.exports=mongoose.model('responses',surveyResponse)