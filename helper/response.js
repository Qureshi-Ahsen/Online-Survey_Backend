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
function successWithData(res, token,user, message) {
    let x = {
        data: {
            token: token,
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        message,
        status: 1
    };
    res.status(200).send(x);
};
module.exports={hashedpassword,successResponseWithData,successWithData}