const express=require('express');
const router=express.Router();
const authRoute=require('./auth')
const surveyRouter=require('./survey')

router.use('/auth',authRoute)
router.use('/survey',surveyRouter)

module.exports=router