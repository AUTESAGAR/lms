import mongoose from "mongoose";

const courseOrderSchema = mongoose.Schema({
    courseId : {type:String,required:true},
    userId : {type:String,required:true},    
    courseFees : {type:Number,required:true},
    status : {type:String,required:true,default:"pending"},
});

const courseOrderHandler = mongoose.model("order", courseOrderSchema);

export default courseOrderHandler;
