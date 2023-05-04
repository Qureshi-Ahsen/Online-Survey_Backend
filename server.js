const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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
const sessionStore = new MongoStore({
  mongoUrl: 'mongodb+srv://ahsenqureshi5555:ahsensys123@cluster0.kbxrecn.mongodb.net/sessionstore'
});
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 5 * 60 * 1000 } // Set cookie max age to 5 minutes
}));

app.listen(port, () => {
  console.log(`server is up and running at:${port}`);
});