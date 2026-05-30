import mongoose from "mongoose"
const  connectedDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongo db connected");
    }
    catch(error)
    {
        process.exit(1);
        console.log("db is not connected")
    }
}
export default connectedDb;

