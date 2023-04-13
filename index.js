const express = require('express');
const app = express();
const port = 5000;
const dotenv=require('dotenv').config();
const routes=require('./router');
const connectDB = require('./config/database');
app.use('/api',routes)

connectDB();
app.use('*',(req,res)=>{
    res.send('this end point is not available')
});
app.listen(port, () => {
  console.log(`server is up and running at:${port}`);
});