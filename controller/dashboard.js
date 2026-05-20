import courseHandler from "../model/course.js";
import courseOrderHandler from "../model/courseOrder.js";
import userHandler from "../model/user.js";

export async function dashboard(req,res){
    const userData = await userHandler.findById(req.user._id);    
    const regUsersData = await userHandler.find({role:"user"});
    const courseData = await courseHandler.find({});
    const ordersData = await courseOrderHandler.find({status:"paid"});
    const enqueriesData = await courseOrderHandler.find({status:"pending"});
    return res.render("dashboard",{
        userData:userData,
        regUsersData:regUsersData,
        courseData:courseData,
        ordersData:ordersData,
        enqueriesData:enqueriesData
    });
}

export async function ourCourses(req,res){
    const userData = await userHandler.findById(req.user._id);
    const courseData = await courseHandler.find({});
    return res.render("./course/our-courses",{userData:userData,courseData:courseData});
}