import courseHandler from "../model/course.js";
import userHandler from "../model/user.js";

export async function home(req,res){
    const userData = await userHandler.findById(req.user._id);
    const courseData = await courseHandler.find({});
    return res.render("home",{userData:userData,courseData:courseData});
}