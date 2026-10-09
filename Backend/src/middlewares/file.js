const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is PDF
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware to check if file was uploaded
const checkFileUpload = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded. Please resume a PDF file." });
    }
    next();
};

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large! Maximum size is 3MB." });
        }
        if (err.message === 'Only PDF files are allowed!') {
            return res.status(400).json({ message: "Invalid file type. Only PDF files are allowed." });
        }
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

module.exports = { upload, checkFileUpload, handleMulterError };
