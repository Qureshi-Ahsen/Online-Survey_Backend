const saltRounds=10;
const bcrypt=require('bcrypt')

async  function  hashedpassword(password){
   const hashpassword=await bcrypt.hash(password,saltRounds);
   return hashpassword
};

function successResponseWithData(res,data, message){
    let x = {
        data,
        message,
        status:1
    };
    res.status(200).send(x);
};
module.exports={hashedpassword,successResponseWithData}