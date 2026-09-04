import mongoose from "mongoose";
const examSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    subject:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    totalMarks:{
        type:Number,
        default:0
    },
    teacherId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
    },
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft"

    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    }
},
{
    timestamps:true
})


const examModel = mongoose.model("Exam", examSchema);

export default examModel;