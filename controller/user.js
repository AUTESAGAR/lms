import { compare, hash } from "bcryptjs";
import userHandler from "../model/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import emailValidator from "email-validator";

export async function reg(req,res){
    return res.render("reg",{userData:"",message:null});
}

export async function regSubmit(req, res) {
    try {
        let { name, mobile, email, password } = req.body;
        name = name?.trim();
        mobile = mobile?.trim();
        email = email?.trim().toLowerCase();

        if (!name || !mobile || !email || !password) {
            return res.render("reg",{userData:"",message:"All Fields Are Required"});
        }

        if (!req.file) {
            return res.render("reg",{userData:"",message:"Please upload profile photo"});
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return res.render("reg",{userData:"",message:"Invalid Mobile Number"});
        }
        const existingMobile = await userHandler.findOne({ mobile });
        if (existingMobile) {
            return res.render("reg",{userData:"",message:"Mobile already registered"});
        }
        const isValidFormat = emailValidator.validate(email);
        if (!isValidFormat) {
            return res.render("reg",{userData:"",message:"Invalid Email Format"});
        }
        const existingEmail = await userHandler.findOne({ email });
        if (existingEmail) {
            return res.render("reg",{userData:"",message:"Email already registered"});
        }
        password = await hash(password, 10);
        const photo = req.file.filename;
        await userHandler({name,mobile,email,password,photo}).save();
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            const message = field === "mobile" ? "Mobile already registered" : "Email already registered";
            return res.render("reg",{userData:"",message});
        }
        return res.render("reg",{userData:"",message:"Unable to register. Please check your details"});
    }
}

export async function login(req,res){
    return res.render("login",{userData:"",message:""});
}

export async function loginSubmit(req,res){
    try{
        const {email,password} = req.body;
        const userData = await userHandler.findOne({email:email});
        if(!userData) return res.render("login",{userData:"",message:"User Not Exist"});
        const match = await compare(password,userData.password);
        if(!match) return res.render("login",{userData:"",message:"Invalid Password"});
        if(match){
            if(userData.role=="admin"){
                const token = jwt.sign(
                    {_id: userData._id, role: userData.role},
                    process.env.SESSION_SECRET,
                    { expiresIn: "365d" }
                );
                res.cookie("token",token, {httpOnly: true});
                return res.redirect("/dashboard");
            }
            else{
                const token = jwt.sign(
                    { _id: userData._id, role: userData.role },
                    process.env.SESSION_SECRET,
                    { expiresIn: "365d" }
                );
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 24 * 365
                });
                return res.redirect("/home");
            }
        } 
    }
    catch(error){
        console.log(error);
        return res.render("login",{userData:"",message:"Unable to login. Please try again"});
    }
}

export async function logout(req,res){
    res.clearCookie("token");
    return res.redirect("/login");
}

export async function forgotPassword(req,res){
    return res.render("forgot-password",{userData:"",message:""});
}

export async function forgotPasswordSubmit(req,res){
    const {email} = req.body;
    const userData = await userHandler.findOne({email:email});
    if(!userData) return res.send(`<center>User Not Exist : <a href="/forgot-password">Go Back</a></center>`);
    const otp = Date.now().toString().substring(7,13);
    await userHandler.findByIdAndUpdate({_id:userData._id},{otp:otp});
    
    async function sendMail(){
        const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user:"autesagar57@gmail.com",
            pass:"mfmwjayeyrazpvqg",
        }
        });
        const mailOptions = {
            from : "autesagar57@gmail.com",
            to : userData.email,
            subject : "OTP For Change Password (sanvi-infotech-solution)",
            html : `<h3>OTP For Change Password</h3>
                    <p>Your OTP For Change Password Is : <b>${otp}</b>
                    </p>`
        }
        try{
            await transporter.sendMail(mailOptions); console.log("Mail Send Success...");
        }
        catch(err){ console.log("Error Send Mail",err); }
    };
    sendMail();
    res.redirect("/change-password");
}


export async function changePassword(req,res){
    return res.render("change-password",{userData:"",message:""});
}

export async function changePasswordSubmit(req,res){
    const {password,confirmPassword,otp} = req.body;
    const userData = await userHandler.findOne({otp:otp});
    if(!userData) return res.render("change-password",{userData:"",message:"Invalid OTP"});
    if(password!=confirmPassword) return res.render("change-password",{userData:"",message:"Password Not Matched"});
    const hashPassword = await hash(password,10);
    await userHandler.findByIdAndUpdate({_id:userData._id},{password:hashPassword});
    await userHandler.findByIdAndUpdate({_id:userData._id},{$unset: {otp: ""}});
    res.redirect("/login");
}

export async function editProfile(req,res){
    const userData = await userHandler.findById({_id:req.user._id});
    if(userData) return res.render("edit-profile",{userData:userData,message:""});
}

export async function editProfileSubmit(req,res){
    const name = req.body.name?.trim();
    const mobile = req.body.mobile?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !mobile || !email) {
        const userData = await userHandler.findById({_id:req.user._id});
        return res.render("edit-profile",{userData:userData,message:"All Fields Are Required"});
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        const userData = await userHandler.findById({_id:req.user._id});
        return res.render("edit-profile",{userData:userData,message:"Invalid Mobile Number"});
    }

    if (!emailValidator.validate(email)) {
        const userData = await userHandler.findById({_id:req.user._id});
        return res.render("edit-profile",{userData:userData,message:"Invalid Email Format"});
    }

    const duplicateUser = await userHandler.findOne({
        _id: {$ne: req.user._id},
        $or: [{email}, {mobile}]
    });

    if (duplicateUser) {
        const userData = await userHandler.findById({_id:req.user._id});
        const message = duplicateUser.email === email ? "Email already registered" : "Mobile already registered";
        return res.render("edit-profile",{userData:userData,message});
    }

    if(name && mobile && email && req.file){
        await userHandler.findByIdAndUpdate({_id:req.user._id},{name:name,mobile:mobile,email:email,photo:req.file.filename});
        return res.redirect("/home");
    }
    else{
        await userHandler.findByIdAndUpdate({_id:req.user._id},{name:name,mobile:mobile,email:email});
        return res.redirect("/home");
    }
}
