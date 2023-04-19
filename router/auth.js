const express = require('express');
const router = express.Router();
const registerController = require('../controller/register');
const loginController=require('../controller/login')
bodyParser = require('body-parser').json();
const auth=require('../middleware/auth')


router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/reset',auth,loginController.resetPassword)


module.exports = router;