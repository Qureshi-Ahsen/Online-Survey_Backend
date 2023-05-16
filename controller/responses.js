const Response = require('../models/response');
const Survey = require('../models/survey');
const apiresponse = require('../helper/response');

const response = async (req, res) => {
  try {
    const {  answers,name,email } = req.body;
    console.log(req.body)
    const surveyId=req.params.id
     if(!surveyId || surveyId.trim()===''){
      apiresponse.errorResponseBadRequest(res,"please enter surveyId in parameters")
     }; 
   
     if(!name || name.trim()===''){
      apiresponse.errorResponseBadRequest(res,"please enter name")
     };
     if(!email || email.trim()===''){
      apiresponse.errorResponseBadRequest(res,"please enter email")
     };
       

    const surveyResponse = new Response({ surveyId, answers,name,email });
    const savedResponse = await surveyResponse.save();

    const survey = await Survey.findById(surveyId);

    const mappedAnswers = savedResponse.answers.map((answer, index) => {
      if (answer && answer.answer) { 
        const question = survey.questions[index];
        const questionText = question ? question.text : 'Question not found';
        const questionType = question ? question.qType: "question type not found";
        const questionOptions = question && question.options ? question.options : undefined;
        return { ...answer.toObject(), question: questionText, questionType: questionType, qOptions: questionOptions };
      }
      return answer;
    });

    
    const updatedResponse = await Response.findByIdAndUpdate(
      savedResponse._id,
      { answers: mappedAnswers },
      { new: true }
    );

    apiresponse.successResponseWithData(res, updatedResponse, "Response posted successfully.");
  } catch (error) {
  console.log(error)
    return apiresponse.errorResponseServer(res, "Internal server error.");
  }
};


module.exports = response;
