const express = require('express');
const session = require('express-session');
const app = express();
const port = 5000;
const dotenv=require('dotenv').config();
const routes=require('./router');
const bodyParser=require('body-parser')
const cors = require('cors')
app.use(cors());
 app.use(bodyParser.json());
 app.use(bodyParser.json({ type: 'application/*+json' }));
 app.use(bodyParser.urlencoded({ extended: false }));
const connectDB = require('./config/database');
app.use('/api',routes)
connectDB();
app.use('*',(req,res)=>{
    res.send('this end point is not available')
});
app.use(session({
  secret: 'my-secret-key',
  resave: false, 
  saveUninitialized: false, 
  cookie: { secure: true } 
}));
app.listen(port, () => {
  console.log(`server is up and running at:${port}`);
});