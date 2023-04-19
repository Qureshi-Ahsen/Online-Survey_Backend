const user=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const apiresponse=require('../helper/response');
const nodemailer=require('nodemailer')


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
       const User=await user.findOne({email});
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
      return apiresponse.errorResponse(res, "user does not exist");
    }
    const matchPassword = await bcrypt.compare(oldPassword, admin.password);
    if (!matchPassword) {
      return apiresponse.errorResponse(res, "Old password is incorrect");
    }
    if (newPassword !== confirmPassword) {
      return apiresponse.errorResponse(res, "New passwords do not match");
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
    const {email}=req.body;
    if(!email || email.trim()===''){
      apiresponse.errorResponse(res,"enter email")
    };
    const userData=await user.findOne(email);
    if(!userData){
      apiresponse.errorResponse(res,"User with email not found");
      return;
    };
    const resetToken= await jwt.sign(userData.password,process.env.SECRET_KEY ,{expiresIn:'10m'});
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: '',
      },
    });
    const mailOptions = {
      from: '<your-gmail-username>',
      to: email,
      subject: 'Password Reset Request',
      text: `Your password reset token is: ${resetToken}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Password reset email sent' });
      }
    });
  
  } catch (error) {
    apiresponse.errorResponse(res,"internal server error")
  }
};


const changePassword=async(req,res)=>{
  try {
    const { resetToken, newPassword } = req.body;

 
  jwt.verify(resetToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: 'Invalid or expired reset token' });
    } else {
      const { email } = decoded;

 
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
  

      res.json({ message: 'Password updated successfully' });
    }
  });

  } catch (error) {
    apiresponse.errorResponse(res,"internal server error")
  }
}
module.exports={login,resetPassword}