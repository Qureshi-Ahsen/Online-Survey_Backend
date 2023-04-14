const express=require('express')
const router=express.Router()

const surveyIn=require('../controller/surveys')

router.post('/create',surveyIn)

module.exports=router;