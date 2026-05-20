import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name: {type:String,required:true},
    mobile: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    photo: {type:String,required:true},
    otp: {type:String,default:null},
    role: {type:String,enum:["user","admin"],default:"user"},
})

const userHandler = new mongoose.model("user",adminSchema);

export default userHandler;