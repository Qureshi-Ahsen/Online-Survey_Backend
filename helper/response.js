function successResponseWithData(res,data, message){
    let x = {
        data,
        message,
        status:1
    };
    res.status(200).send(x);
};

function errorResponse(res,message) {
    let x={
        message,
        status:0
    }
    res.status(500).send(x)
};
function successResponseWithoutData(res,message){
    let x={
        message,
        status:1
    }
    res.status(200).send(x)
    
}
module.exports={successResponseWithData,errorResponse,successResponseWithoutData}