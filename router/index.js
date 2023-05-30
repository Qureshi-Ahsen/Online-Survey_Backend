const express=require('express');
const router=express.Router();
const authRoute=require('./auth')
const surveyRouter=require('./survey')
const analyticsRouter=require('./analytics')
// const auth=require('../middleware/auth')

router.use('/auth',authRoute)
router.use('/survey',surveyRouter)
router.use('/analytics',analyticsRouter)

module.exports=router