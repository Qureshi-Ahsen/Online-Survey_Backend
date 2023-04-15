const Response = require('../models/response');
const Survey = require('../models/survey');
const apiresponse = require('../helper/response');

const response = async (req, res) => {
  try {
    const { surveyId, answers } = req.body;

    const surveyResponse = new Response({ surveyId, answers });
    const savedResponse = await surveyResponse.save();

    const survey = await Survey.findById(surveyId);

    const mappedAnswers = savedResponse.answers.map((answer, index) => {
      if (answer && answer.answer) { 
        const question = survey.questions[index];
        const questionText = question ? question.text : 'Question not found';
        return { ...answer.toObject(), question: questionText };
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

    apiresponse.errorResponse(res, "Internal server error.");
  }
};

module.exports = response;
