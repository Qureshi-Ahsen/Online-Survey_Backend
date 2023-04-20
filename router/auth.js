const express = require('express');
const router = express.Router();
const registerController = require('../controller/register');
const loginController=require('../controller/login')
bodyParser = require('body-parser').json();
const auth=require('../middleware/auth');
const reset=require('../middleware/reset')


router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/reset',auth,loginController.resetPassword);
router.post('/forgot',loginController.forgotPassword)
router.post('/change',reset,loginController.changePassword)


module.exports = router;