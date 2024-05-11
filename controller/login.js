const user=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const apiresponse=require('../helper/response');
const nodemailer=require('nodemailer')
const otpGenerator=require('otp-generator')
const otpModel=require('../models/otp')
const Handlebars=require('handlebars')
const moment=require('moment')

const login=async (req,res)=>{
    try {
       const {email,password}=req.body;
       if(!email || email.trim() === ''){
        res.status(400).send('please enter email');
        return;
       };
       if(!password || password.trim() === ''){
        res.status(400).send('please enter password');
        return;
       };
       const User=await user.findOne({email:email});
       if(User){
               const matchpassword=await bcrypt.compare(password,User.password)
                 if(!matchpassword){
                 res.status(400).send('Invalid password')
                  return;
       };
       const accessToken=await jwt.sign({_id:User._id, name:User.name, email:User.email},process.env.ACCESSTOKEN_KEY,{expiresIn:'2h'})
       const refreshToken= await jwt.sign({_id:User._id},process.env.REFRESHTOKEN_KEY,{expiresIn:'7d'});
       User.refreshToken=refreshToken;
       await User.save();
       const tokens={accessToken,refreshToken}
           apiresponse.successResponseWithData(res, tokens, 'logged in successfully');
        }
       else{
          res.status(400).send('Invalid email');
         return;
        }  
    } catch (error) {
        return res.status(500).send('internal server error');
    }
};


const resetPassword = async (req, res) => {
  try {
    const _id = req.user;
    const { newPassword, confirmPassword, oldPassword } = req.body;
    const admin = await user.findById(_id,{password:1});
    if (!admin) {
      return apiresponse.errorResponseBadRequest(res, "user does not exist");
    }
    const matchPassword = await bcrypt.compare(oldPassword, admin.password);
    if (!matchPassword) {
      return apiresponse.errorResponseBadRequest(res, "Old password is incorrect");
    }
    if (newPassword !== confirmPassword) {
      return apiresponse.errorResponseBadRequest(res, "New passwords do not match");
    } else {
      const changedPassword = await bcrypt.hash(newPassword, 10);
      const updatedPassword = admin.password = changedPassword;
      await admin.save();
      return apiresponse.successResponseWithoutData(res, "password changed successfully");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

const forgotPassword=async(req,res)=>{
  try {
    const { email } = req.body;
    if (!email || email.trim() === '') {
      apiresponse.errorResponseBadRequest(res, 'Please enter your email address');
      return;
    }
    console.log( req.body)
    const userData = await user.findOne({ email },{password:0,refreshToken:0});
    if (!userData) {
      apiresponse.errorResponseBadRequest(res, 'User with email not found');
      return;
    }
    console.log(userData)
      const otp= await otpGenerator.generate(6,{lowerCaseAlphabets:true,digits:true,specialChars:true})
      const saveOtp=new otpModel({otp:otp,userId:userData._id})
      await saveOtp.save();
      const savedDate=moment.utc(userData.createdAt)
      const localDate=savedDate.local();
      formatedlocalDate=localDate.format('YY-DD-MM HH:mm:ss')
      expirationTime=localDate.add(5,'minutes')
      expirationformattedTime=expirationTime.format('YY-DD-MM HH:mm:ss')
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user://user of mail trap tp be inserted,
        pass: // pass of mailtrap
      }
    });
 

    const templateSource = `
    <div style=' background-color:white'>
    <h1 style='color: black ;size:3rem ;font-weight:900 ; font-family: Helvetica,Arial,sans-serif;margin:20px 30px 10px 50px; 
    '>Hi <span style="color: #00466a ;font-size:2rem;font-weight:900 ; font-family: Helvetica,Arial,sans-serif;">{{name}}</span></h1>
    <p style='color:grey ;font-weight:400; margin:20px 30px 10px 50px  ; '>Thank you for choosing Your Brand.You requested otp for changing password at {{time}}, Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 mintes and will expire at {{expire}} </p><br/><br/>
    <p style='margin:0 auto; color:white; font-size:2.5rem; background:#00466a;width:max-content; border-radius:6px;padding: 7px;'>{{otp}}</p>
  </div>
  `;
  
const template = Handlebars.compile(templateSource);
const data = {
  name:userData.name,
  otp: otp,
  time:formatedlocalDate,
  expire:expirationformattedTime
  
};
const html = template(data);

const mailOptions = {
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Password Reset Request',
  html: html,
};

  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        return apiresponse.successResponseWithoutData(res,"password reset email has been sent");
      }
    });
  
  } catch (error) {
    console.log(error)
    return apiresponse.errorResponseServer(res,"internal server error")
  }
};


const changePassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    console.log( req.body)
    const findOtp = await otpModel.findOne({ otp: otp });
    if (!findOtp) {
      apiresponse.errorResponseBadRequest(res, "Invalid OTP code");
      return;
    }
    const otpExpiration = (Date.now() - findOtp.createdAt) / 1000 / 60;
    if (otpExpiration > 5) {
      apiresponse.errorResponseBadRequest(res, "OTP code has expired");
      return;
    }
    const userData = await user.findById(findOtp.userId, { password: 1 });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userData.password = hashedPassword;
    await userData.save();
    await otpModel.deleteOne({ otp: otp });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return apiresponse.errorResponseServer(res, "Internal server error");
  }
};

const refrehtoken=async (req,res)=>{
 
  try {
    const {refreshToken}=req.body
    if(!refreshToken){
      apiresponse.errorResponseBadRequest(res,"please enter request token in body")
      return
    }
    const decoded= await jwt.verify(refreshToken,process.env.REFRESHTOKEN_KEY)
    if(!decoded){
    return  apiresponse.errorResponseBadRequest(res,"invalid user")
    };

    const User=await user.findOne({_id:decoded._id},{refreshToken:1});
    if(User.refreshToken !== refreshToken ){
      return res.status(404).send("invalid token")
    };
   
    const generateAccessToken = (User) =>{
      return   jwt.sign({_id:User._id, name:User.name, email:User.email},process.env.ACCESSTOKEN_KEY,{expiresIn:'2h'})
    };
    const accessToken=generateAccessToken(User)
    apiresponse.successResponseWithData(res,accessToken,"access token generated successfully")

  } catch (error) {
    console.log(error)
    return apiresponse.errorResponseServer(res, "Internal server error");
  }
}

module.exports={login,resetPassword,forgotPassword,changePassword,refrehtoken}
