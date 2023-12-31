const multer = require('multer');
const path = require('path');
const fs = require('fs');

// define the upload path
const uploadPath = path.join(__dirname, '../uploads');

// Ensure upload path exists
fs.mkdirSync(uploadPath, { recursive: true });

// Define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Define the upload object
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Please upload a PDF file'));
        }
        cb(null, true);
    }
}).single('resume');

module.exports = upload;