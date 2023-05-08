const express=require('express')
const router=express.Router()
const surveyRes=require('../controller/responses')
const surveyIn=require('../controller/surveys')
const auth=require('../middleware/auth')
router.post('/create',auth,surveyIn.survey)
router.post('/response',surveyRes),
router.get('/all',auth,surveyIn.getSurveysById)
router.get('/info/:id', auth,surveyIn.getSurveyById)
router.get('/responses/info/:id',auth,surveyIn.getSurveyResponses)
router.get('/response/info/:id',auth,surveyIn.getSurveyResponse)
router.put('/update/:id',auth,surveyIn.updateSurvey);

router.get('/data/:id',auth,surveyIn.getSurveyByIdQuestions);
router.delete('/delete/:id',auth,surveyIn.deleteSurvey)
module.exports=router;