import courseHandler from "../model/course.js";

export async function about(req,res){        
    return res.render("about",{userData:""});
}