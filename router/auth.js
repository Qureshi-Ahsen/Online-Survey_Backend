const express=require('express');
const router=express.Router();
const registerControl=require('../controller/register')

router.post('/register',registerControl.registerController)





module.exports=router