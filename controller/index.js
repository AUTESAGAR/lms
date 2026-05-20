import courseHandler from "../model/course.js";

export async function index(req,res){
    if(req.session.user){
        return res.redirect("/dashboard");
    }
    else{
        const courseData = await courseHandler.find({});
        return res.render("index",{userData:"",courseData:courseData});
    }
}