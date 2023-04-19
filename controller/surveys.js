const surveyModel=require('../models/survey')
const apiresponse=require('../helper/response');
const responseModel=require('../models/response')

const survey=async(req,res)=>{
 try {
     const {_id}=req.user;
     const{title,description,questions}=req.body;
     if(!title || title.trim()  ===''){
        return apiresponse.errorResponse(res,"please enter an title");
     }
     if(!description || description.trim() ===''){
      return apiresponse.errorResponse(res,"please enter an description");
     }
     const filterQuestion = questions.filter(str => typeof str === 'string' && str.trim() === '');
       if (!questions || filterQuestion.length === questions.length) {
        return apiresponse.errorResponse(res, "please enter at least one question");
       }
     const doc = new surveyModel({title,description,questions,createdBy:_id})
     await doc.save();
  
      return apiresponse.successResponseWithoutData(res,'survey created succesfully')
    }
 catch (error) {
   console.log(error)
   return apiresponse.errorResponse(res,'internal server error');   
  }
};


const getSurveysById=async (req,res)=>{
  try {
     
   const {_id}=req.user;
          if(!_id){
             apiresponse.errorResponse(res,'please enter token');
           
             return;
         }
      const surveys= await surveyModel.find({createdBy:_id},{questions:0,updatedAt:0});
      return apiresponse.successResponseWithData(res,surveys,'Operation successful');
   } catch (error) {
     return apiresponse.errorResponse(res,'internal server error');
   }
};

const getSurveyById=async(req,res)=>{
     try {
       const id=req.params.id
           if(!id){
            apiresponse.errorResponse(res,'Please enter Survey id in request parameters');
            return;
            }
       const survey=await surveyModel.findById({_id:id},{title:1,description:1,questions:1,status:1});
       return apiresponse.successResponseWithData(res,survey,"operation successful");
     } catch (error) {
      
      return apiresponse.errorResponse(res,'internal server error');

     }
};

const getSurveyByIdQuestions=async(req,res)=>{
   try {
     const id=req.params.id
         if(!id){
          apiresponse.errorResponse(res,'Please enter Survey id in request parameters');
          return;
          }
     const survey=await surveyModel.findById({_id:id},{questions:1});
     return apiresponse.successResponseWithData(res,survey,"operation successful");
   } catch (error) {
    
    return apiresponse.errorResponse(res,'internal server error');

   }
};

const getSurveyResponses=async(req,res)=>{
   try {
      const id=req.params.id;
        if(!id){
           apiresponse.errorResponse(res,'Please enter Survey id in request parameters');
           return;
       }
      const surveyResponse=await responseModel.find({surveyId:id},{name:1,email:1,createdAt:1})
      
      return apiresponse.successResponseWithData(res,surveyResponse,"operation successful");

   } catch (error) {
      return apiresponse.errorResponse(res,'internal server error');   
   }
};
const getSurveyResponse=async(req,res)=>{
   try {
      const id=req.params.id;
        if(!id){
           apiresponse.errorResponse(res,'Please enter response id in request parameters');
           return;
       }
      const surveyResponse=await responseModel.find({_id:id},{name:1,answers:1})
      
      return apiresponse.successResponseWithData(res,surveyResponse,"operation successful");

   } catch (error) {
      return apiresponse.errorResponse(res,'internal server error');   
   }
};
const updateSurvey=async(req,res)=>{
   try {
      const _id=req.params.id;
      if(!_id){
         apiresponse.errorResponse(res,'Please enter response id in request parameters');
         return;
      };
      const updateSurveys= await responseModel.findByIdAndUpdate(_id,req.body,{new:true});
      const newSurvey=await updateSurveys;
      return apiresponse.successResponseWithData(res,newSurvey,'operation successful')

   } catch (error) {
      return apiresponse.errorResponse(res,'internal server error');   
   }
};
const deleteSurvey=async(req,res)=>{
  try {
   const _id=req.params.id;
   if(!_id){
      apiresponse.errorResponse(res,'Please enter response id in request parameters');
      return;
   };
   await responseModel.findByIdAndDelete(_id);
   return apiresponse.successResponseWithoutData(res,"survey `${_id}` deleted successfully");
  } catch (error) {
   return apiresponse.errorResponse(res,'internal server error'); 
  }
};

module.exports={survey,getSurveysById,getSurveyById,getSurveyResponses,getSurveyResponse,updateSurvey,deleteSurvey,getSurveyByIdQuestions};