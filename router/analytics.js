const express=require('express');
const router= express.Router();
const analytics=require('../controller/analytics');
const auth = require('../middleware/auth');

router.post('/responses',auth,analytics.analyticsData)
module.exports=router;