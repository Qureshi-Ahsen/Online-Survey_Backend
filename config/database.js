const mongoose=require('mongoose');

const connectDB=async()=>{
    try {
      const conn=await mongoose.connect(process.env.MONGODB_URL) ;
      console.log(`MONGODB CONNECTED at :${conn.connection.host}`)
    } catch (error) {
       console.log(error)
    }
}
module.exports=connectDB