const surveyModel=require('../models/survey')
const apiresponse=require('../helper/response')

const survey=async(req,res)=>{
 try {

    const doc = new surveyModel(req.body)
     await doc.save();
  
        apiresponse.successResponseWithoutData(res,'survey created succesfully')
    }
 catch (error) {
    apiresponse.errorResponse(res,'internal server error')
   
 }
};


module.exports=survey;