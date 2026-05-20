import multer from "multer";
import path from "path";

const allowedMimeTypes = new Set([
    "video/mp4",
]);

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{ 
        return cb(null,'./uploads/course-content'); 
    },    
    filename:(req,file,cb)=>{ 
        return cb(null,`${Date.now()}-${file.originalname}`); 
    },
});

const videoUploads = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = [".mp4"];

        if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.includes(ext)) {
            return cb(null, true);
        }

        return cb(new Error("Only MP4 video files are allowed"));
    },
});

export default videoUploads;
