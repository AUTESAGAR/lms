import mongoose from "mongoose";

const courseContentSchema = mongoose.Schema({
    courseId : {type:String,required:true},
    title : {type:String,required:true},
    youtubeUrl : {type:String,required:true},
});

const courseContentHandler = mongoose.model("courseContent", courseContentSchema);

export default courseContentHandler;
