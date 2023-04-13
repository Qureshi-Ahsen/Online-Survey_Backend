const express = require('express');
const router = express.Router();
const registerController = require('../controller/register');
bodyParser = require('body-parser').json();


router.post('/register',registerController.register);


module.exports = router;