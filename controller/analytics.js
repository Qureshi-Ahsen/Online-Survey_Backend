const responseModel = require('../models/response');
const apiresponse = require('../helper/response');
const surveyModel = require('../models/survey');
const moment = require('moment');

const analyticsData = async (req, res) => {
  try {
    const user = req.user;
    const { startDate, endDate } = req.body;
    if (!user._id) {
      return apiresponse.errorResponseBadRequest(res, "Id was not present in auth token");
    }
    if (!startDate || startDate.trim() === '') {
      return apiresponse.errorResponseBadRequest(res, "Start Date was not present in Request Query");
    }
    if (!endDate || endDate.trim() === '') {
      return apiresponse.errorResponseBadRequest(res, "End Date was not present in Request Query");
    }

    const validStartDate = moment(startDate, 'YYYY-MM-DD', true).isValid();
    if (!validStartDate) {
      return apiresponse.errorResponseBadRequest(res, "Start Date is not a valid date type");
    }
    const validEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();
    if (!validEndDate) {
      return apiresponse.errorResponseBadRequest(res, "End Date is not a valid date type");
    }
    const startDateUTC = moment.utc(startDate, 'YYYY-MM-DD').startOf('day');
    const endDateUTC = moment.utc(endDate, 'YYYY-MM-DD').endOf('day');
    const userData = await surveyModel.find({ createdBy: user._id }, { _id: 1 });
    if (!userData || userData.length === 0) {
      return apiresponse.errorResponseBadRequest(res, "User not found");
    }
    
    const surveyIds = userData.map(user => user._id);
    const responseCounts = {};
    let totalResponses=0
    for (const surveyId of surveyIds) {
      const queryCriteria = {
        surveyId,
        createdAt: { $gte: startDateUTC, $lte: endDateUTC }
      };
      const responseData = await responseModel.find(queryCriteria).exec();
      const responseCount = await responseModel.countDocuments(queryCriteria).exec();

      responseCounts[surveyId] = {
        responseData,
        responseCount
      };
      totalResponses += responseCount
    }

    if (Object.keys(responseCounts).length === 0) {
      return apiresponse.successResponseWithData(res, "No response submitted yet");
    } else {
      return apiresponse.successResponseWithData(res,{responseCounts,totalResponses}, `Successfully retrieved  Responses submitted between ${startDate} and     ${endDate} `);
    }
  } catch (error) {
    console.log(error);
    return apiresponse.errorResponseServer(res, "An error occurred");
  }
};
const responseGraph=async(req,res)=>{
  try {
    const user=req.user;
    if(!user._id){
    return  apiresponse.errorResponseBadRequest(res,"Auth Token does Not contain User Id")
    }
    const userData=await surveyModel.find({createdBy:user._id},{_id:1});
    if(!userData || userData.length===0){
    return  apiresponse.errorResponseBadRequest("User Not Found")
    }
    const surveyIds = userData.map(user => user._id);
 
const responseCounts = await surveyModel.aggregate([
  {
    $match: {
      _id: { $in: surveyIds }
    }
  },
  {
    $lookup: {
      from: "responses",
      localField: "_id",
      foreignField: "surveyId",
      as: "responses"
    }
  },
  {
    $addFields: {
      responseCount: { $size: "$responses" }
    }
  },
  {
    $project: {
      _id: 1,
      title: 1,
      responseCount: 1
    }
  }
]).exec();
    return apiresponse.successResponseWithData(res,responseCounts,"Retrieved Survey Titles With Response Count For Each Survey")
  } catch (error) {
    console.log(error)
    return apiresponse.errorResponseServer(res,"An Error Occured")
  }
}

module.exports = { analyticsData,responseGraph };
