import courseHandler from "../model/course.js";
import courseContentHandler from "../model/courseContent.js";
import courseOrderHandler from "../model/courseOrder.js";
import userHandler from "../model/user.js";

function getYoutubeEmbedUrl(url) {
    if (!url) return "";

    try {
        const parsedUrl = new URL(url.trim());
        let videoId = "";

        if (parsedUrl.hostname.includes("youtu.be")) {
            videoId = parsedUrl.pathname.replace("/", "");
        } else if (parsedUrl.pathname.startsWith("/shorts/")) {
            videoId = parsedUrl.pathname.split("/")[2];
        } else if (parsedUrl.pathname.startsWith("/embed/")) {
            videoId = parsedUrl.pathname.split("/")[2];
        } else {
            videoId = parsedUrl.searchParams.get("v");
        }

        if (!videoId) return "";
        return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
        return "";
    }
}

export async function addCourse(req,res){
    const userData = await userHandler.findById(req.user._id);
    return res.render("./course/add-course",{userData:userData,message:""});
}

export async function addCourseSubmit(req,res){
    const userData = await userHandler.findById(req.user._id);
    const {title,description,fees} = req.body;

    if (!title || !description || !fees) {
        return res.render("./course/add-course",{userData:userData,message:"All fields are required"});
    }

    if (!req.file) {
        return res.render("./course/add-course",{userData:userData,message:"Please upload a course thumbnail"});
    }

    const thumbnail = req.file.filename;
    const data = await courseHandler({title,description,fees,thumbnail}).save();
    return res.redirect(`/add-course-content/${data._id}`);
}

export async function addCourseContent(req,res){
    const courseId = req.params.id;
    const userData = await userHandler.findById(req.user._id);
    const courseData = await courseHandler.findById({_id:courseId});
    const courseContent = await courseContentHandler.find({
        courseId: courseId,
        youtubeUrl: {$exists: true, $ne: ""}
    });
    return res.render("./course/add-course-content",{userData:userData,courseContent:courseContent,courseData:courseData});
}

export async function addCourseContentSubmit(req,res){
    const {courseId,title} = req.body;
    const youtubeUrl = getYoutubeEmbedUrl(req.body.youtubeUrl);

    if (!courseId || !title) {
        return res.status(400).send(`<center>Course and title are required <br><a href="javascript:history.back()">Go Back</a></center>`);
    }

    if (!youtubeUrl) {
        return res.status(400).send(`<center>Please enter a valid YouTube URL <br><a href="javascript:history.back()">Go Back</a></center>`);
    }

    await courseContentHandler({
        courseId,
        title,
        youtubeUrl
    }).save();
    return res.redirect(`/add-course-content/${courseId}`);
}

export async function editCourseContent(req,res){
    const courseContentId = req.params.id;
    const userData = await userHandler.findById(req.user._id);    
    const courseContent = await courseContentHandler.findById({_id:courseContentId});
    return res.render("./course/edit-course-content",{userData:userData,courseContent:courseContent,courseContentData:courseContent});
}

export async function editCourseContentSubmit(req,res){
    const {title,courseContentId,courseId} = req.body;
    const youtubeUrl = getYoutubeEmbedUrl(req.body.youtubeUrl);

    if (!youtubeUrl) {
        return res.status(400).send(`<center>Please enter a valid YouTube URL <br><a href="javascript:history.back()">Go Back</a></center>`);
    }

    await courseContentHandler.findByIdAndUpdate({_id:courseContentId},{
        title:title,
        youtubeUrl
    });
    return res.redirect("/add-course-content/"+courseId);
}

export async function deleteCourseContent(req,res){
    const courseContentId = req.params.id;
    const courseContent = await courseContentHandler.findById({_id:courseContentId});
    await courseContentHandler.findByIdAndDelete({_id:courseContentId});
    return res.redirect("/add-course-content/"+courseContent.courseId);
}

export async function editCourse(req,res){ 
    const id = req.params.id;
    const userData = await userHandler.findById(req.user._id);
    const courseData = await courseHandler.findById({_id:id});
    return res.render("./course/edit-course",{courseData:courseData,userData:userData});     
}

export async function deleteCourse(req,res){    
    const id = req.params.id;
    await courseHandler.findByIdAndDelete({_id:id});
    await courseContentHandler.deleteMany({courseId:id});
    await courseOrderHandler.deleteMany({courseId:id});
    return res.redirect("/our-courses");
}

export async function editCourseSubmit(req, res) {
    const id = req.params.id;
    const { title, description, fees } = req.body;
    const courseData = await courseHandler.findById(id);
    let thumbnail = courseData.thumbnail;
    if (req.file) {thumbnail = req.file.filename;}
    await courseHandler.findByIdAndUpdate({_id:id},{
            title:title,
            description:description,
            fees: fees,
            thumbnail:thumbnail
        }
    ).then(()=>{
        return res.redirect("/dashboard");
    })
}

export async function viewCourse(req,res){
    const courseId = req.params.id;
    const userData = await userHandler.findById(req.user._id);
    const courseData = await courseHandler.findById({_id:courseId});
    const courseContent = await courseContentHandler.find({
        courseId: courseId,
        youtubeUrl: {$exists: true, $ne: ""}
    });
    const existingPaidOrder = await courseOrderHandler.findOne({
        courseId: courseId,
        userId: req.user._id,
        status: "paid"
    });
    return res.render("./course/view-course",{
        courseData:courseData,
        courseContent:courseContent,
        userData:userData,
        alreadyPurchased: Boolean(existingPaidOrder)
    });
}

export async function myCourses(req,res){
    const userData = await userHandler.findById(req.user._id);
    const courseOrders = await courseOrderHandler.find({status:"paid",userId:req.user._id});
    const courseIds = courseOrders.map(order=>order.courseId);
    const courseData = await courseHandler.find({_id:{$in:courseIds}});
    if(courseOrders.length == 0){
        return res.render("./course/my-courses",{courseData:"",userData:userData});
    }
    return res.render("./course/my-courses",{courseData:courseData,userData:userData});
}

export async function learnCourse(req, res) {
    try {
        const courseId = req.params.id;
        const courseData = await courseHandler.findById(courseId);
        const userData = await userHandler.findById(req.user._id);
        const paidOrder = await courseOrderHandler.findOne({
            courseId: courseId,
            userId: req.user._id,
            status: "paid"
        });

        if (!paidOrder) {
            return res.status(403).send(`<center>Please purchase this course first <br><a href="/home">Go Back</a></center>`);
        }

        const courseVideos = await courseContentHandler.find({
            courseId: courseId,
            youtubeUrl: {$exists: true, $ne: ""}
        });

        if (!courseData || courseVideos.length === 0) {
            return res.status(404).send(`<center>Course content is not available <br><a href="/my-courses">Go Back</a></center>`);
        }

        return res.render("course/learn-course", {courseData,courseVideos,userData});
    } catch (error) {
        console.log(error);
        return res.status(500).send(`<center>Unable to load course. Please try again. <br><a href="/my-courses">Go Back</a></center>`);
    }
}
