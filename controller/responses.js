const Response = require('../models/response');
const Survey = require('../models/survey');
const apiresponse = require('../helper/response');

const response = async (req, res) => {
  try {
    const { surveyId, answers,name,email } = req.body;
     if(!surveyId || surveyId.trim()===''){
      apiresponse.errorResponse(res,"pleane enter surveyId")
     };
     const filterAnswer = answers.filter(str => typeof str === 'string' && str.trim() === '');
       if (!answers || filterAnswer.length === answers.length) {
        return apiresponse.errorResponse(res, "please give at least one answer");
       }
     if(!name || name.trim()===''){
      apiresponse.errorResponse(res,"pleane enter name")
     };
     if(!email || email.trim()===''){
      apiresponse.errorResponse(res,"pleane enter email")
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
    return apiresponse.errorResponse(res, "Internal server error.");
  }
};


module.exports = response;
