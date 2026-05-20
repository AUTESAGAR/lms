import multer from "multer";
import path from "path";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
]);

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{ 
        return cb(null,'./uploads'); 
    },    
    filename:(req,file,cb)=>{ 
        return cb(null,`${Date.now()}-${file.originalname}`); 
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

        if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.includes(ext)) {
            return cb(null, true);
        }

        return cb(new Error("Only JPG, PNG, WEBP and AVIF image files are allowed"));
    },
});

export default upload;
