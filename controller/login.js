const user=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const apiresponse=require('../helper/response')

const login=async (req,res)=>{
    try {
       const {email,password}=req.body;
       if(!email || email.trim() === ''){
        res.status(400).send('please enter email');
        return;
       }else{
       if(!password || password.trim() === ''){
        res.status(400).send('please enter password');
        return;
       }
       }
       const User=await user.findOne({email});
       if(User){
        const matchpassword=await bcrypt.compare(password,User.password)
         if(!matchpassword){
            res.status(400).send('invalid password')
            return;
          }
      
        const token=await jwt.sign({_id:User._id, name:User.name, email:User.email},process.env.SECRET_KEY,{expiresIn:'2h'})
        apiresponse.successResponseWithData(res, token, 'logged in successfully');
       }
       else{
        res.status(400).send('invalid email');
        return;
       }
       
       
    } catch (error) {
        console.log(error)
        res.status(500).send('internal server error');
    }
}
module.exports={login}