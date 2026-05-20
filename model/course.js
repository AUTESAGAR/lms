import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    title : {type:String,required:true},
    description : {type:String,required:true},
    fees : {type:Number,required:true},
    thumbnail : {type:String,required:true},    
});

const courseHandler = mongoose.model("course",courseSchema);

export default courseHandler;