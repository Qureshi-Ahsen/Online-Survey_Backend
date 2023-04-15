const express=require('express')
const router=express.Router()
const surveyRes=require('../controller/responses')
const surveyIn=require('../controller/surveys')
const auth=require('../middleware/auth')
router.post('/create',auth,surveyIn)
router.post('/response',surveyRes)

module.exports=router;