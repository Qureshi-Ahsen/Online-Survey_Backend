const express = require('express');
const app = express();
const port = 5000;
const dotenv=require('dotenv').config();
const routes=require('./router');
const bodyParser=require('body-parser')
const cors=require('cors')
 app.use(bodyParser.json());
 app.use(bodyParser.json({ type: 'application/*+json' }));
 app.use(bodyParser.urlencoded({ extended: false }));
const connectDB = require('./config/database');
app.use('/api',routes)
app.use(cors());

connectDB();
app.use('*',(req,res)=>{
    res.send('this end point is not available')
});
app.listen(port, () => {
  console.log(`server is up and running at:${port}`);
});