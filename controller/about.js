import courseHandler from "../model/course.js";

export async function about(req,res){
    if(req.session.user){
        return res.redirect("/home");
    }
    else{        
        return res.render("about",{userData:""});
    }
}