import mongoose from "mongoose"
const userschema=new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
    enum:["student","teacher","admin"],
    default:"student"   
},
},{
    timestamps:true
})
const userModel=mongoose.model("user",userschema);
export default userModel;