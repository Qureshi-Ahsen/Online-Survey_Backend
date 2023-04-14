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
         }],

    }]
})
module.exports= mongoose.model('survey',surveys)
