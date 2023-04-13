const userModel=require('../models/user')
const apiResponse=require('../helper/response')

const registerController=async(req,res)=>{
   
    try {
  
        if(!req.body.name){
            res.status(400).send('please enter your name');
        };
        if(!req.body.email){
            res.staus(400).send('please enter your email');
        };
        if(!req.body.password){
            res.staus(400).send('please enter an password');
        };
        
              
        if(req.body.email){
       await userModel.findOne({email:req.body.email}),{id:1}.then async user =>{
        
       }
       
        if(user){
            res.status(400).send("User with email already exists ")
        }
        else{
            
            console.log(hi)
           const hashpassword=await apiResponse.hashedpassword(password);
           const Users=await userModel({
            name:req.body.name,
            email:req.body.email,
            password:hashpassword,
           
           }) 
           
           
           const User=await Users.save();
           apiResponse.successResponseWithData(res,User,'user successfully registered')
        }
    }
    } catch (error) {
        res.status(500).send('internal server error')
        console.log (error)
    }
};
module.exports={registerController}