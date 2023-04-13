const saltRounds=10;


async  function  hashedpassword(password){
   const hashpassword=await bcrypt.hash(password,saltRounds);
   return hashpassword
};

function successResponseWithData(res,data,msg){
    let x ={
        data,
        status:1,
        msg
    }
}
module.exports={hashedpassword,successResponseWithData}