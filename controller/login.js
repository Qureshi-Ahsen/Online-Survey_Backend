const user=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const apiresponse=require('../helper/response');
const nodemailer=require('nodemailer')
const otpGenerator=require('otp-generator')
const otpModel=require('../models/otp')


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
                 res.status(400).send('invalid password')
                  return;
       };
       const token=await jwt.sign({_id:User._id, name:User.name, email:User.email},process.env.SECRET_KEY,{expiresIn:'2h'})
           apiresponse.successResponseWithData(res, token, 'logged in successfully');
        }
       else{
          res.status(400).send('invalid email');
         return;
        }  
    } catch (error) {
        res.status(500).send('internal server error');
    }
};


const resetPassword = async (req, res) => {
  try {
    const _id = req.user;
    const { newPassword, confirmPassword, oldPassword } = req.body;
    const admin = await user.findById(_id);
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
    res.status(500).send("internal server error");
  }
};

const forgotPassword=async(req,res)=>{
  try {
    const { email } = req.body;
    if (!email || email.trim() === '') {
      apiresponse.errorResponseBadRequest(res, 'Please enter your email address');
      return;
    }
    const userData = await user.findOne({ email },{password:0});
    if (!userData) {
      apiresponse.errorResponseBadRequest(res, 'User with email not found');
      return;
    }
    console.log(userData)
      const otp= await otpGenerator.generate(6,{lowerCaseAlphabets:true,digits:true,specialChars:true})
      const saveOtp=new otpModel({otp:otp,userId:userData._id})
      console.log(otp)
      await saveOtp.save();
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "28952fea80fd81",
        pass: "54ec0531e87ebe"
      }
    });
    const mailOptions = {
      from: '28952fea80fd81',
      to: email,
      subject: 'Password Reset Request',
      text: `Your password reset otp is: ${ otp} please enter this otp`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        apiresponse.successResponseWithoutData(res,"password reset email has been sent");
      }
    });
  
  } catch (error) {
    console.log(error)
    apiresponse.errorResponseServer(res,"internal server error")
  }
};


const changePassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
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
    apiresponse.errorResponseServer(res, "Internal server error");
  }
};
module.exports={login,resetPassword,forgotPassword,changePassword}