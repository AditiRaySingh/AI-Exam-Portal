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
        required:true
    },
    teacherId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"user"
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