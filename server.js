import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import dashboardRouter from "./routes/dashboard.js";
import courseRouter from "./routes/course.js"
import homeRouter from "./routes/home.js"
import courseOrderRouter from "./routes/courseOrder.js";
import aboutRouter from "./routes/about.js";
import contactRouter from "./routes/contact.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
const PORT = process.env.PORT || 1000;

function loadEnvFile() {
    if (!fs.existsSync(".env")) return;

    const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) continue;

        const separatorIndex = trimmedLine.indexOf("=");
        if (separatorIndex === -1) continue;

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

        if (key && !process.env[key]) {
            process.env[key] = value;
        }
    }
}

loadEnvFile();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(cors({origin: true,credentials: true}));
app.use(cookieParser());

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static("./static"));
app.use(express.static("../static"));
app.use(express.static("./uploads"));
app.use(express.static("../uploads"));
app.use("/course-content", express.static("./uploads/course-content"));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
});

app.set("view engine","ejs");
app.set("views","./views");

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/vit-technology-solution";

mongoose.connect(mongoUri)
.then(()=>{ console.log("DB Connected"); })
.catch((error)=>{ console.log("DB Connection Error:", error.message); });

app.use(indexRouter);
app.use(userRouter);
app.use(dashboardRouter);
app.use(courseRouter);
app.use(homeRouter);
app.use(courseOrderRouter);
app.use(aboutRouter);
app.use(contactRouter);
app.use((err, req, res, next) => {
    console.log(err);
    const message = err.message || "Something went wrong. Please try again.";
    return res.status(400).send(`<center>${message} <br><a href="javascript:history.back()">Go Back</a></center>`);
});

app.listen(PORT, () => {
  console.log(`Server Started : http://localhost:${PORT}`);
});
